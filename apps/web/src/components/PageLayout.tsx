import type { LucideIcon } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { BackButton } from "./BackButton";
import { IconBadge } from "./ui/IconBadge";
import type { Tone } from "./ui/styles";

type Props = {
  lang: Locale;
  dict: Dictionary;
  title: string;
  icon: LucideIcon;
  tone: Tone;
  children: React.ReactNode;
};

/** Standard inner page: navy title band with Back, then content cards. */
export function PageLayout({ lang, dict, title, icon, tone, children }: Props) {
  return (
    <>
      <div className="bg-brand pb-12 text-white">
        <div className="mx-auto max-w-2xl space-y-4 px-4 pt-2">
          <BackButton label={dict.back} homeHref={`/${lang}`} />
          <div className="flex items-center gap-4">
            <span className="rounded-2xl bg-white">
              <IconBadge icon={icon} tone={tone} size="lg" />
            </span>
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight rtl:leading-[1.9]">{title}</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto -mt-8 max-w-2xl space-y-4 px-4 pb-10">{children}</div>
    </>
  );
}
