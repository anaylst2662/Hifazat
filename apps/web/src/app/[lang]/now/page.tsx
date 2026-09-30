import { notFound } from "next/navigation";
import { Siren } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageLayout } from "@/components/PageLayout";
import { ComingSoon } from "@/components/ComingSoon";
import { Notice } from "@/components/ui/Notice";

// "I'm in Danger". Phase 2 adds emergency call buttons (numbers come from
// the verified database, never from the code) and offline support.
export default async function DangerPage({ params }: PageProps<"/[lang]/now">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <PageLayout lang={lang} dict={dict} title={dict.homeDangerLabel} icon={Siren} tone="danger">
      <Notice tone="danger">{dict.dangerPlaceholderNote}</Notice>
      <ComingSoon dict={dict} phase={2} />
    </PageLayout>
  );
}
