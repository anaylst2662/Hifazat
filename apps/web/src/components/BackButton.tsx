"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { hasPreviousHifazatPage } from "@/lib/nav-history";

type Props = { label: string; homeHref: string };

/**
 * On-screen Back button. Goes to the previous Hifazat page, or to the home
 * page if this is the first Hifazat page opened in the tab.
 */
export function BackButton({ label, homeHref }: Props) {
  const router = useRouter();
  return (
    <a
      href={homeHref}
      onClick={(event) => {
        if (hasPreviousHifazatPage()) {
          event.preventDefault();
          router.back();
        }
      }}
      className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-line bg-card px-4 py-2 font-semibold text-ink hover:border-brand"
    >
      {/* The arrow flips to point right in Urdu (right-to-left). */}
      <ArrowLeft aria-hidden="true" className="size-5 rtl:rotate-180" />
      <span>{label}</span>
    </a>
  );
}
