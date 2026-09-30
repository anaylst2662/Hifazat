import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Hifazat",
  referrer: "no-referrer",
  icons: { icon: "/icons/icon-192.png" },
};

// Minimal frame for the starting address "/" only.
export default function EntryLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
