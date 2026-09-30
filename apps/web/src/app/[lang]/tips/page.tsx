import { notFound } from "next/navigation";
import { EyeOff, History, LockKeyhole, LogOut, Smartphone, Users, type LucideIcon } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SectionPage } from "@/components/SectionPage";

// "Staying safe online": browser history, shared devices, private mode.
export default async function TipsPage({ params }: PageProps<"/[lang]/tips">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const tips: { icon: LucideIcon; title: string; body: string }[] = [
    { icon: LogOut, title: dict.tipsQuickExitTitle, body: dict.tipsQuickExitBody },
    { icon: History, title: dict.tipsHistoryTitle, body: dict.tipsHistoryBody },
    { icon: EyeOff, title: dict.tipsPrivateTitle, body: dict.tipsPrivateBody },
    { icon: Users, title: dict.tipsSharedTitle, body: dict.tipsSharedBody },
    { icon: Smartphone, title: dict.tipsHomeScreenTitle, body: dict.tipsHomeScreenBody },
  ];

  return (
    <SectionPage lang={lang} dict={dict} title={dict.tipsTitle} icon={LockKeyhole} iconClassName="bg-brand text-white">
      <p className="text-lg">{dict.tipsIntro}</p>
      <ul className="space-y-4">
        {tips.map(({ icon: Icon, title, body }) => (
          <li key={title} className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <Icon aria-hidden="true" className="size-6 shrink-0 text-brand" />
              {title}
            </h2>
            <p className="mt-2 text-ink-soft">{body}</p>
          </li>
        ))}
      </ul>
      <p className="rounded-2xl bg-brand-soft p-5 font-semibold">{dict.tipsOutro}</p>
    </SectionPage>
  );
}
