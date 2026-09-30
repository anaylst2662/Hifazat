import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LifeBuoy } from "lucide-react";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { format } from "@/i18n/format";
import { pickText } from "@/i18n/pick";
import { getAwareness, getContentItem } from "@/lib/awareness";
import { PageLayout } from "@/components/PageLayout";
import { ContentBody } from "@/components/learn/ContentBody";
import { ScenarioReveal } from "@/components/learn/ScenarioReveal";
import { Quiz } from "@/components/learn/Quiz";
import { CampaignShare } from "@/components/learn/CampaignShare";
import { SampleBadge } from "@/components/learn/SampleBadge";
import { typeLook } from "@/components/learn/icons";
import { QUIZ_TEXT } from "@/components/text-keys";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { buttonClass, sectionTitleClass } from "@/components/ui/styles";

export const revalidate = 3600;

// Pre-build a page for every item that exists when the site is built;
// newer items are built on first visit.
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const lang = isLocale(params.lang) ? params.lang : locales[0];
  const result = await getAwareness(lang);
  return result.status === "ok" ? result.items.map((i) => ({ code: i.code })) : [];
}

export default async function ContentPage({ params }: PageProps<"/[lang]/learn/[code]">) {
  const { lang, code } = await params;
  if (!isLocale(lang) || !/^[a-z0-9]{4,12}$/.test(code)) notFound();
  const dict = getDictionary(lang);
  const { result, item } = await getContentItem(lang, code);
  if (result.status === "ok" && !item) notFound();

  if (!item) {
    return (
      <PageLayout lang={lang} dict={dict} title={dict.homeLearnLabel} icon={typeLook.article.icon} tone="learn">
        <Notice tone="danger">{dict.learnUnavailable}</Notice>
      </PageLayout>
    );
  }

  const look = typeLook[item.type];
  const audiences = result.status === "ok" ? result.audiences.filter((a) => item.audienceIds.includes(a.id)) : [];

  return (
    <PageLayout lang={lang} dict={dict} title={item.title} icon={look.icon} tone={look.tone}>
      {item.isSample && (
        <Notice title={dict.sampleNoticeTitle}>
          <SampleBadge label={dict.sampleBadge} />
          <span className="mt-1 block">{dict.sampleNoticeBody}</span>
        </Notice>
      )}
      {item.lang !== lang && <Notice>{dict.contentNotTranslated}</Notice>}

      {item.summary && item.type !== "scenario" && item.type !== "quiz" && (
        <p className="px-1 text-lg font-medium text-ink">{item.summary}</p>
      )}

      {item.imageUrl && (
        <Card className="overflow-hidden p-0!">
          <Image
            src={item.imageUrl}
            alt={item.imageAlt ?? ""}
            width={1080}
            height={1080}
            sizes="(max-width: 672px) 100vw, 640px"
            className="h-auto w-full"
            data-testid="content-image"
          />
        </Card>
      )}

      {item.type === "scenario" && item.scenarioSituation && item.scenarioAnswer ? (
        <ScenarioReveal
          situation={item.scenarioSituation}
          answer={item.scenarioAnswer}
          actions={item.scenarioActions}
          text={pickText(dict, ["scenarioSituationTitle", "scenarioReveal", "scenarioAnswerTitle", "scenarioActionsTitle"])}
        />
      ) : null}

      {item.type === "quiz" && item.quiz ? <Quiz questions={item.quiz} text={pickText(dict, QUIZ_TEXT)} /> : null}

      {item.body && (
        <Card>
          <ContentBody text={item.body} />
        </Card>
      )}

      {item.type === "campaign" && item.imageUrl && (
        <Card className="space-y-3">
          <h2 className={sectionTitleClass}>{dict.shareTitle}</h2>
          {item.isSample && <p className="text-sm font-medium text-banner-ink">{dict.shareSampleWarning}</p>}
          <CampaignShare
            imageUrl={item.imageUrl}
            shareText={item.shareText ?? item.title}
            fileName={`hifazat-${item.code}-${item.lang}.jpg`}
            text={pickText(dict, ["shareImage", "shareWhatsapp", "shareDownload"])}
          />
        </Card>
      )}

      {item.videoUrl && (
        <Card className="space-y-2">
          <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "w-full")}>
            <ExternalLink aria-hidden="true" className="size-5" />
            {dict.videoWatch}
          </a>
          <p className="text-sm text-ink-soft">{dict.videoExternal}</p>
        </Card>
      )}

      {audiences.length > 0 && (
        <p className="px-1 text-sm text-ink-soft">
          {format(dict.contentUsefulFor, { list: audiences.map((a) => a.name).join(lang === "ur" ? "، " : ", ") })}
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <Link href={`/${lang}/services`} className={buttonClass("secondary")}>
          <LifeBuoy aria-hidden="true" className="size-5" />
          {dict.contentFindHelp}
        </Link>
        <Link href={`/${lang}/learn`} className={buttonClass("secondary")}>
          {dict.learnAllContent}
        </Link>
      </div>
    </PageLayout>
  );
}
