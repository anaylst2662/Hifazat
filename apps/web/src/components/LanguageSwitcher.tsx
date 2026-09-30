"use client";

import { usePathname } from "next/navigation";
import { LANGUAGE_STORAGE_KEY, type Locale } from "@/i18n/config";
import { buttonClass } from "./ui/styles";

type Props = { target: Locale; label: string; ariaLabel: string };

/** Shows "اردو" in English and "English" in Urdu; remembers the choice in this browser. */
export function LanguageSwitcher({ target, label, ariaLabel }: Props) {
  const pathname = usePathname();
  const href = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${target}`);
  return (
    // A normal link (full page load) so text direction and fonts switch cleanly.
    <a
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      data-testid="language-switcher"
      onClick={() => {
        try {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, target);
        } catch {
          // Storage may be blocked (private mode); the switch still works.
        }
      }}
      className={buttonClass("onBrand", `px-4 ${target === "ur" ? "font-urdu text-[15px] font-normal" : "font-sans"}`)}
    >
      {label}
    </a>
  );
}
