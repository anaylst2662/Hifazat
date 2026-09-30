import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

export function AppFooter({ lang, dict }: Props) {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-2xl space-y-3 px-4 py-6 text-[0.9375rem] text-ink-soft">
        <Link
          href={`/${lang}/tips`}
          className="inline-flex min-h-12 items-center gap-2 font-semibold text-brand underline-offset-4 hover:underline"
        >
          <ShieldCheck aria-hidden="true" className="size-5" />
          {dict.footerSafetyLink}
        </Link>
        <p>{dict.footerHonesty}</p>
        <p className="hidden md:block">{dict.quickExitShortcutTip}</p>
      </div>
    </footer>
  );
}
