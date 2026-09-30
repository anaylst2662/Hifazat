import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ClipboardList, HeartHandshake, Siren } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pickText } from "@/i18n/pick";
import { getContacts } from "@/lib/contacts";
import { PageLayout } from "@/components/PageLayout";
import { ContactCallButton } from "@/components/ContactCallButton";
import { DistrictNumbers } from "@/components/DistrictNumbers";
import { TrustedMessage } from "@/components/TrustedMessage";
import { TRUSTED_MESSAGE_TEXT } from "@/components/text-keys";
import { Card } from "@/components/ui/Card";
import { IconBadge } from "@/components/ui/IconBadge";
import { Notice } from "@/components/ui/Notice";
import { pressable, sectionTitleClass } from "@/components/ui/styles";

// Re-check Supabase for updated numbers at most once an hour. The page is
// pre-built, so it loads fast and is saved for offline use.
export const revalidate = 3600;

// "I'm in Danger": emergency call buttons come first on the screen. No login, no forms.
export default async function DangerPage({ params }: PageProps<"/[lang]/now">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const result = await getContacts(lang);

  const callLabels = pickText(dict, ["callAria", "available24h", "placeholderBadge"]);
  const national = result.status === "ok" ? result.contacts.filter((c) => !c.districtId) : [];
  const emergency = national.filter((c) => c.kind === "emergency");
  const helplines = national.filter((c) => c.kind !== "emergency");
  const hasPlaceholders = result.status === "ok" && result.contacts.some((c) => c.isPlaceholder);

  return (
    <PageLayout lang={lang} dict={dict} title={dict.homeDangerLabel} icon={Siren} tone="danger">
      {hasPlaceholders && (
        <Notice tone="danger" title={dict.placeholderWarningTitle}>
          {dict.placeholderWarningBody}
        </Notice>
      )}

      {result.status === "unavailable" && <Notice tone="danger">{dict.numbersUnavailable}</Notice>}

      {emergency.length > 0 && (
        <section aria-labelledby="emergency-title" className="space-y-3">
          <h2 id="emergency-title" className={`px-1 ${sectionTitleClass}`}>
            {dict.emergencyTitle}
          </h2>
          {emergency.map((c) => (
            <ContactCallButton key={c.id} contact={c} labels={callLabels} />
          ))}
        </section>
      )}

      {/* Honest wording right after the call buttons: no false promises. */}
      <Card className="space-y-2">
        <p className="text-lg font-semibold text-ink">{dict.dangerIntro}</p>
        <p className="text-ink-soft">{dict.dangerHonesty}</p>
      </Card>

      <TrustedMessage text={pickText(dict, TRUSTED_MESSAGE_TEXT)} planHref={`/${lang}/plan`} />

      <Card className="space-y-3">
        <h2 className={sectionTitleClass}>{dict.stepsTitle}</h2>
        <ol className="space-y-3">
          {[dict.step1, dict.step2, dict.step3, dict.step4].map((step, i) => (
            <li key={step} className="flex gap-3">
              <span
                aria-hidden="true"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand"
              >
                {i + 1}
              </span>
              <span className="pt-0.5 text-ink">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {helplines.length > 0 && (
        <section aria-labelledby="helplines-title" className="space-y-3">
          <h2 id="helplines-title" className={`flex items-center gap-2 px-1 ${sectionTitleClass}`}>
            <HeartHandshake aria-hidden="true" className="size-5 text-brand" />
            {dict.helplinesTitle}
          </h2>
          {helplines.map((c) => (
            <ContactCallButton key={c.id} contact={c} labels={callLabels} />
          ))}
        </section>
      )}

      {result.status === "ok" && result.districts.length > 0 && (
        <DistrictNumbers
          contacts={result.contacts}
          districts={result.districts}
          labels={{
            ...callLabels,
            ...pickText(dict, ["districtTitle", "districtChoose", "districtPlaceholder", "districtEmpty", "districtPrivacy"]),
          }}
        />
      )}

      <Link
        href={`/${lang}/plan`}
        className={`flex min-h-20 items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[var(--shadow-card)] hover:border-ink-soft/40 ${pressable}`}
      >
        <IconBadge icon={ClipboardList} tone="brand" />
        <span className="flex-1">
          <span className="block text-lg font-semibold text-ink">{dict.planTitle}</span>
          <span className="block text-[0.9375rem] text-ink-soft">{dict.planHint}</span>
        </span>
        <ChevronRight aria-hidden="true" className="size-5 text-ink-soft rtl:rotate-180" />
      </Link>
    </PageLayout>
  );
}
