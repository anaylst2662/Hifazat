import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { otherLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { QuickExitButton } from "./QuickExitButton";

type Props = { lang: Locale; dict: Dictionary; showPreviewBanner: boolean };

/** Top of every public page: logo, language switcher and Quick Exit (always visible). */
export function AppHeader({ lang, dict, showPreviewBanner }: Props) {
  return (
    <header className="sticky top-0 z-40">
      {showPreviewBanner && (
        <p className="bg-banner px-4 py-1 text-center text-sm font-medium text-banner-ink">{dict.previewBanner}</p>
      )}
      <div className="bg-brand">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-2.5">
          <Link
            href={`/${lang}`}
            aria-label={dict.home}
            className="inline-flex min-h-12 items-center gap-2 rounded-lg text-white focus-visible:outline-white"
          >
            <ShieldCheck aria-hidden="true" className="size-7 shrink-0" strokeWidth={2} />
            <span className="text-lg font-bold tracking-tight">{dict.appName}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher target={otherLocale(lang)} label={dict.switchLanguageLabel} ariaLabel={dict.switchLanguageAria} />
            <QuickExitButton label={dict.quickExit} ariaLabel={dict.quickExitAria} />
          </div>
        </div>
      </div>
    </header>
  );
}
