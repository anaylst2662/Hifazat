import { notFound } from "next/navigation";
import { Siren } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SectionPage } from "@/components/SectionPage";
import { ComingSoon } from "@/components/ComingSoon";

// "I'm in Danger". Phase 2 adds emergency call buttons (numbers come from
// the verified database, never from the code) and offline support.
export default async function DangerPage({ params }: PageProps<"/[lang]/now">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <SectionPage lang={lang} dict={dict} title={dict.homeDangerLabel} icon={Siren} iconClassName="bg-danger text-white">
      <p className="rounded-2xl border-2 border-danger bg-card p-5 text-lg font-semibold">
        {dict.dangerPlaceholderNote}
      </p>
      <ComingSoon dict={dict} phase={2} />
    </SectionPage>
  );
}
