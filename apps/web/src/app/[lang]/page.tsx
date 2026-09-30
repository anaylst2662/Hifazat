import { notFound } from "next/navigation";
import { BookOpen, FileText, HeartHandshake, LifeBuoy } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { DangerCard } from "@/components/DangerCard";
import { ActionTile } from "@/components/ActionTile";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <div className="bg-brand pb-16 text-white">
        <div className="mx-auto max-w-2xl px-4 pt-3">
          <p className="text-[0.9375rem] text-white/80">{dict.tagline}</p>
          <h1 className="mt-1 text-[1.75rem] font-bold leading-tight tracking-tight rtl:leading-[1.9]">
            {dict.homeTitle}
          </h1>
        </div>
      </div>

      {/* Neutral web addresses: none of them name the situation. */}
      <nav aria-label={dict.homeTitle} className="mx-auto -mt-12 max-w-2xl space-y-3 px-4 pb-8">
        <DangerCard href={`/${lang}/now`} label={dict.homeDangerLabel} hint={dict.homeDangerHint} />
        <div className="grid grid-cols-2 gap-3">
          <ActionTile href={`/${lang}/learn`} label={dict.homeLearnLabel} hint={dict.homeLearnHint} icon={BookOpen} tone="learn" />
          <ActionTile href={`/${lang}/services`} label={dict.homeHelpLabel} hint={dict.homeHelpHint} icon={LifeBuoy} tone="help" />
          <ActionTile href={`/${lang}/form`} label={dict.homeReportLabel} hint={dict.homeReportHint} icon={FileText} tone="report" />
          <ActionTile
            href={`/${lang}/guide`}
            label={dict.homeSupportingLabel}
            hint={dict.homeSupportingHint}
            icon={HeartHandshake}
            tone="support"
          />
        </div>
      </nav>
    </>
  );
}
