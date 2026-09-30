import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SectionPage } from "@/components/SectionPage";
import { ComingSoon } from "@/components/ComingSoon";

export default async function Page({ params }: PageProps<"/[lang]/learn">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <SectionPage lang={lang} dict={dict} title={dict.homeLearnLabel} icon={BookOpen} iconClassName="bg-learn text-white">
      <ComingSoon dict={dict} phase={3} />
    </SectionPage>
  );
}
