import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SectionPage } from "@/components/SectionPage";
import { ComingSoon } from "@/components/ComingSoon";

export default async function Page({ params }: PageProps<"/[lang]/form">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <SectionPage lang={lang} dict={dict} title={dict.homeReportLabel} icon={FileText} iconClassName="bg-report text-report-ink">
      <ComingSoon dict={dict} phase={5} />
    </SectionPage>
  );
}
