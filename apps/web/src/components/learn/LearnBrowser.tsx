"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { sectionTitleClass } from "../ui/styles";
import { ContentCard, type CardItem } from "./ContentCard";
import { topicIcon, typeLook, type ContentType } from "./icons";

type BrowserItem = CardItem & { topicId: string; audienceIds: string[] };
type Named = { id: string; name: string };

type Text = Record<
  | "learnAudienceLabel" | "learnAudienceAll" | "learnTopicsTitle" | "learnTopicAll" | "learnScenariosTitle"
  | "learnGuidesTitle" | "learnQuizzesTitle" | "learnCampaignsTitle" | "learnEmpty" | "sampleBadge"
  | "typeArticle" | "typeInfographic" | "typeVideo" | "typeFaq" | "typeScenario" | "typeQuiz" | "typeCampaign",
  string
>;

type Props = {
  lang: string;
  items: BrowserItem[];
  topics: (Named & { icon: string })[];
  audiences: Named[];
  text: Text;
};

const chip = (selected: boolean) =>
  `inline-flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[0.9375rem] font-medium transition ${
    selected ? "border-brand bg-brand text-white" : "border-line bg-surface text-ink hover:border-ink-soft/50"
  }`;

const sections: { key: keyof Text; types: ContentType[] }[] = [
  { key: "learnScenariosTitle", types: ["scenario"] },
  { key: "learnGuidesTitle", types: ["article", "faq", "infographic", "video"] },
  { key: "learnQuizzesTitle", types: ["quiz"] },
  { key: "learnCampaignsTitle", types: ["campaign"] },
];

/**
 * The Awareness Hub list with audience and topic filters. Filters live only in
 * this page (not in the web address), so the address never shows a topic.
 */
export function LearnBrowser({ lang, items, topics, audiences, text }: Props) {
  const [audience, setAudience] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const visible = items.filter(
    (i) => (!audience || i.audienceIds.includes(audience)) && (!topic || i.topicId === topic),
  );
  const usedTopics = topics.filter((t) => items.some((i) => i.topicId === t.id));

  return (
    <>
      <Card className="space-y-3">
        <p id="audience-label" className="font-medium text-ink">{text.learnAudienceLabel}</p>
        <div role="group" aria-labelledby="audience-label" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <button type="button" aria-pressed={audience === null} onClick={() => setAudience(null)} className={chip(audience === null)}>
            {text.learnAudienceAll}
          </button>
          {audiences.map((a) => (
            <button key={a.id} type="button" aria-pressed={audience === a.id} onClick={() => setAudience(a.id)}
                    className={chip(audience === a.id)} data-testid={`audience-${a.id}`}>
              {a.name}
            </button>
          ))}
        </div>
      </Card>

      <section aria-labelledby="topics-title" className="space-y-3">
        <h2 id="topics-title" className={`px-1 ${sectionTitleClass}`}>{text.learnTopicsTitle}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button type="button" aria-pressed={topic === null} onClick={() => setTopic(null)}
                  className={`${chip(topic === null)} justify-center`}>
            {text.learnTopicAll}
          </button>
          {usedTopics.map((t) => {
            const Icon = topicIcon(t.icon);
            return (
              <button key={t.id} type="button" aria-pressed={topic === t.id} onClick={() => setTopic(topic === t.id ? null : t.id)}
                      className={`${chip(topic === t.id)} justify-start`} data-testid={`topic-${t.id}`}>
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                <span className="truncate">{t.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {visible.length === 0 && <p className="px-1 text-ink-soft">{text.learnEmpty}</p>}

      {sections.map(({ key, types }) => {
        const list = visible.filter((i) => types.includes(i.type));
        if (list.length === 0) return null;
        return (
          <section key={key} aria-labelledby={`section-${key}`} className="space-y-3">
            <h2 id={`section-${key}`} className={`px-1 ${sectionTitleClass}`}>{text[key]}</h2>
            {list.map((item) => (
              <ContentCard
                key={item.code}
                item={item}
                href={`/${lang}/learn/${item.code}`}
                typeLabel={text[typeLook[item.type].label as keyof Text]}
                sampleLabel={text.sampleBadge}
              />
            ))}
          </section>
        );
      })}
    </>
  );
}
