import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Noto_Nastaliq_Urdu, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { isLocale, locales, textDirection } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { AppHeader } from "@/components/AppHeader";
import { QuickExitScript } from "@/components/QuickExitScript";
import { AppFooter } from "@/components/AppFooter";
import { NavTracker } from "@/components/NavTracker";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

// Fonts are stored with the app: visitors' phones never contact Google.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
// The Urdu font is only attached to Urdu pages, so English pages never download it.
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
  const dict = getDictionary(lang);
  return {
    // Neutral tab title on every page: never names the section being viewed.
    title: dict.appName,
    manifest: `/manifest-${lang}.webmanifest`,
    referrer: "no-referrer",
    // Test versions are hidden from search engines until launch.
    robots: showPreviewBanner ? { index: false, follow: false } : undefined,
    icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
    appleWebApp: { capable: true, title: dict.appName, statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  themeColor: "#14325a",
  width: "device-width",
  initialScale: 1,
  // No maximum-scale: people must always be able to zoom.
};

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const fonts = lang === "ur" ? `${jakarta.variable} ${nastaliq.variable}` : jakarta.variable;

  return (
    <html lang={lang} dir={textDirection(lang)} className={fonts}>
      <body className="flex min-h-dvh flex-col">
        {/* First thing on the page, so Quick Exit works before anything else loads. */}
        <QuickExitScript />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-surface focus:p-3"
        >
          {dict.skipToContent}
        </a>
        <AppHeader lang={lang} dict={dict} showPreviewBanner={showPreviewBanner} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <AppFooter lang={lang} dict={dict} />
        <NavTracker />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
