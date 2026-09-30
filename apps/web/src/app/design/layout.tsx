import type { Metadata, Viewport } from "next";
import { Inter, Noto_Nastaliq_Urdu, Nunito_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

// TEMPORARY page: design options for the founder to choose from.
// Delete this folder once a direction is chosen.

const inter = Inter({ subsets: ["latin"], variable: "--font-a", display: "swap" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-b", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-c", display: "swap" });
const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-nastaliq", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Hifazat · Design options",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function DesignLayout({ children }: LayoutProps<"/design">) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable} ${jakarta.variable} ${nastaliq.variable}`}>
      <body>{children}</body>
    </html>
  );
}
