import type { LucideIcon } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { BackButton } from "./BackButton";

type Props = {
  lang: Locale;
  dict: Dictionary;
  title: string;
  icon: LucideIcon;
  iconClassName: string;
  children: React.ReactNode;
};

/** Shared frame for inner pages: Back button, icon and title. */
export function SectionPage({ lang, dict, title, icon: Icon, iconClassName, children }: Props) {
  return (
    <div className="space-y-6">
      <BackButton label={dict.back} homeHref={`/${lang}`} />
      <h1 className="flex items-center gap-3 text-3xl font-bold rtl:leading-[2]">
        <span className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full ${iconClassName}`}>
          <Icon aria-hidden="true" className="size-7" />
        </span>
        {title}
      </h1>
      {children}
    </div>
  );
}
