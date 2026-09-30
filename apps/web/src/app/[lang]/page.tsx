import { notFound } from "next/navigation";
import { BookOpen, FileText, HeartHandshake, LifeBuoy, Siren } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { HomeAction } from "@/components/HomeAction";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="font-semibold text-brand">{dict.tagline}</p>
        <h1 className="text-3xl font-bold leading-snug rtl:leading-[2]">{dict.homeTitle}</h1>
      </div>

      <nav aria-label={dict.homeTitle} className="grid gap-4">
        {/* Neutral web addresses: none of them name the situation. */}
        <HomeAction
          large
          href={`/${lang}/now`}
          label={dict.homeDangerLabel}
          hint={dict.homeDangerHint}
          icon={Siren}
          className="bg-danger text-white"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <HomeAction
            href={`/${lang}/learn`}
            label={dict.homeLearnLabel}
            hint={dict.homeLearnHint}
            icon={BookOpen}
            className="bg-learn text-white"
          />
          <HomeAction
            href={`/${lang}/services`}
            label={dict.homeHelpLabel}
            hint={dict.homeHelpHint}
            icon={LifeBuoy}
            className="bg-help text-white"
          />
          <HomeAction
            href={`/${lang}/form`}
            label={dict.homeReportLabel}
            hint={dict.homeReportHint}
            icon={FileText}
            className="bg-report text-report-ink"
          />
          <HomeAction
            href={`/${lang}/guide`}
            label={dict.homeSupportingLabel}
            hint={dict.homeSupportingHint}
            icon={HeartHandshake}
            className="bg-support text-white"
          />
        </div>
      </nav>

      <p className="text-center text-ink-soft">{dict.pillars}</p>
    </div>
  );
}
