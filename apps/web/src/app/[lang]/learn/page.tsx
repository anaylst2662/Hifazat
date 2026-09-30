import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pickText } from "@/i18n/pick";
import { getAwareness } from "@/lib/awareness";
import { PageLayout } from "@/components/PageLayout";
import { LearnBrowser } from "@/components/learn/LearnBrowser";
import { LEARN_BROWSER_TEXT } from "@/components/text-keys";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";

// Content comes from Supabase and is re-checked at most once an hour.
export const revalidate = 3600;

export default async function LearnPage({ params }: PageProps<"/[lang]/learn">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const result = await getAwareness(lang);

  return (
    <PageLayout lang={lang} dict={dict} title={dict.homeLearnLabel} icon={BookOpen} tone="learn">
      <Card>
        <p className="text-ink">{dict.learnIntro}</p>
      </Card>
      {result.status === "unavailable" && <Notice tone="danger">{dict.learnUnavailable}</Notice>}
      {result.status === "ok" && (
        <>
          {result.items.some((i) => i.isSample) && (
            <Notice title={dict.sampleNoticeTitle}>{dict.sampleNoticeBody}</Notice>
          )}
          <LearnBrowser
            lang={lang}
            // Only what the list needs is sent to the browser.
            items={result.items.map((i) => ({
              code: i.code,
              type: i.type,
              title: i.title,
              summary: i.summary,
              isSample: i.isSample,
              topicId: i.topicId,
              audienceIds: i.audienceIds,
            }))}
            topics={result.topics}
            audiences={result.audiences}
            text={pickText(dict, LEARN_BROWSER_TEXT)}
          />
        </>
      )}
    </PageLayout>
  );
}
