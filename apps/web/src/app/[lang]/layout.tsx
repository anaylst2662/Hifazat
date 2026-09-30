import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import "../globals.css";
import { isLocale, locales, otherLocale, textDirection } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { QuickExit } from "@/components/QuickExit";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { NavTracker } from "@/components/NavTracker";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

// The Urdu font is stored with the app (no request to Google from the
// visitor's phone) and only downloads when an Urdu page is shown.
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  display: "swap",
  preload: false,
});

const showPreviewBanner = process.env.NEXT_PUBLIC_SHOW_PREVIEW_BANNER !== "false";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    // Neutral tab title on every page: never names the section being viewed.
    title: getDictionary(lang).appName,
    manifest: `/manifest-${lang}.webmanifest`,
    referrer: "no-referrer",
    // Test versions are hidden from search engines until launch.
    robots: showPreviewBanner ? { index: false, follow: false } : undefined,
    icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
    appleWebApp: { capable: true, title: getDictionary(lang).appName, statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0f5c4d",
  width: "device-width",
  initialScale: 1,
  // No maximum-scale: people must always be able to zoom.
};

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const other = otherLocale(lang);

  return (
    <html lang={lang} dir={textDirection(lang)} className={lang === "ur" ? nastaliq.variable : undefined}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-card focus:p-3"
        >
          {dict.skipToContent}
        </a>

        <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
          {showPreviewBanner && (
            <p className="bg-report px-4 py-1 text-center text-sm font-semibold text-report-ink">
              {dict.previewBanner}
            </p>
          )}
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2">
            <Link href={`/${lang}`} className="inline-flex min-h-12 items-center gap-2 font-bold text-brand">
              <ShieldCheck aria-hidden="true" className="size-7 shrink-0" />
              <span className="text-xl leading-none">{dict.appName}</span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitch target={other} label={dict.switchLanguageLabel} ariaLabel={dict.switchLanguageAria} />
              <QuickExit label={dict.quickExit} ariaLabel={dict.quickExitAria} />
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
          {children}
        </main>

        <footer className="border-t border-line bg-card">
          <div className="mx-auto max-w-3xl space-y-2 px-4 py-5 text-base text-ink-soft">
            <p>
              <Link href={`/${lang}/tips`} className="font-semibold text-brand underline underline-offset-4">
                {dict.footerSafetyLink}
              </Link>
            </p>
            <p>{dict.footerHonesty}</p>
            <p className="hidden md:block">{dict.quickExitShortcutTip}</p>
          </div>
        </footer>

        <NavTracker />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
