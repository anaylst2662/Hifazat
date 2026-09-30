import { notFound } from "next/navigation";
import { HeartHandshake } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SectionPage } from "@/components/SectionPage";
import { ComingSoon } from "@/components/ComingSoon";

export default async function Page({ params }: PageProps<"/[lang]/guide">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <SectionPage lang={lang} dict={dict} title={dict.homeSupportingLabel} icon={HeartHandshake} iconClassName="bg-support text-white">
      <ComingSoon dict={dict} phase={6} />
    </SectionPage>
  );
}
