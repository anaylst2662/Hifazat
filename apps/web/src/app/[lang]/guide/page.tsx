import { notFound } from "next/navigation";
import { HeartHandshake } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageLayout } from "@/components/PageLayout";
import { ComingSoon } from "@/components/ComingSoon";

export default async function Page({ params }: PageProps<"/[lang]/guide">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <PageLayout lang={lang} dict={dict} title={dict.homeSupportingLabel} icon={HeartHandshake} tone="support">
      <ComingSoon dict={dict} phase={6} />
    </PageLayout>
  );
}
