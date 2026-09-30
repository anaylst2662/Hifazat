"use client";

import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { LANGUAGE_STORAGE_KEY, type Locale } from "@/i18n/config";

type Props = { target: Locale; label: string; ariaLabel: string };

/** Switches to the same page in the other language. */
export function LanguageSwitch({ target, label, ariaLabel }: Props) {
  const pathname = usePathname();
  const href = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${target}`);
  return (
    // A normal link (full page load) so the page direction and font switch cleanly.
    <a
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      onClick={() => {
        try {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, target);
        } catch {
          // Storage may be blocked (private mode); the switch still works.
        }
      }}
      className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full border-2 border-line bg-card px-3 py-2 font-semibold text-ink hover:border-brand"
    >
      <Languages aria-hidden="true" className="hidden size-5 sm:block" />
      <span>{label}</span>
    </a>
  );
}
