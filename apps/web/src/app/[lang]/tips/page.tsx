import { notFound } from "next/navigation";
import { EyeOff, History, LockKeyhole, LogOut, Smartphone, Users, type LucideIcon } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/Card";
import { IconBadge } from "@/components/ui/IconBadge";
import { Notice } from "@/components/ui/Notice";

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
    <PageLayout lang={lang} dict={dict} title={dict.tipsTitle} icon={LockKeyhole} tone="brand">
      <Card>
        <p className="text-ink">{dict.tipsIntro}</p>
      </Card>
      <ul className="space-y-3">
        {tips.map(({ icon, title, body }) => (
          <Card as="li" key={title} className="flex gap-4">
            <IconBadge icon={icon} tone="brand" />
            <div>
              <h2 className="text-lg font-semibold text-ink">{title}</h2>
              <p className="mt-1 text-ink-soft">{body}</p>
            </div>
          </Card>
        ))}
      </ul>
      <Notice>{dict.tipsOutro}</Notice>
    </PageLayout>
  );
}
