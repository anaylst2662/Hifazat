import { notFound } from "next/navigation";
import { LifeBuoy } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageLayout } from "@/components/PageLayout";
import { ComingSoon } from "@/components/ComingSoon";

export default async function Page({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <PageLayout lang={lang} dict={dict} title={dict.homeHelpLabel} icon={LifeBuoy} tone="help">
      <ComingSoon dict={dict} phase={4} />
    </PageLayout>
  );
}
