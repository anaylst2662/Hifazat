import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pickText } from "@/i18n/pick";
import { PageLayout } from "@/components/PageLayout";
import { SafetyPlanEditor } from "@/components/SafetyPlanEditor";
import { SAFETY_PLAN_TEXT } from "@/components/text-keys";

// "My Safety Plan": everything is stored encrypted, only in this browser.
export default async function SafetyPlanPage({ params }: PageProps<"/[lang]/plan">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <PageLayout lang={lang} dict={dict} title={dict.planTitle} icon={ClipboardList} tone="brand">
      <SafetyPlanEditor text={pickText(dict, SAFETY_PLAN_TEXT)} />
    </PageLayout>
  );
}
