"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { hasPreviousHifazatPage } from "@/lib/nav-history";
import { buttonClass } from "./ui/styles";

type Props = { label: string; homeHref: string };

/** Back to the previous Hifazat page, or home if this page was opened directly. */
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
      className={buttonClass("onBrand", "-ms-1 px-4")}
    >
      {/* Points right in Urdu (right-to-left). */}
      <ArrowLeft aria-hidden="true" className="size-5 rtl:rotate-180" />
      <span>{label}</span>
    </a>
  );
}
