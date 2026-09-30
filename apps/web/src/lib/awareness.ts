import "server-only";
import type { Locale } from "@/i18n/config";
import { callFunction, select, supabaseConfigured } from "./supabase-rest";

// Awareness Hub content (see supabase/migrations/*_awareness_content.sql).

export type ContentType = "article" | "infographic" | "video" | "faq" | "scenario" | "quiz" | "campaign";
export type QuizQuestion = { prompt: string; options: string[]; correct: number; explanation?: string };

export type ContentItem = {
  id: string;
  code: string; // short neutral code used in the web address
  type: ContentType;
  topicId: string;
  audienceIds: string[];
  isSample: boolean;
  isCore: boolean;
  lang: string; // language of the text (may be English if no translation yet)
  title: string;
  summary: string | null;
  body: string | null;
  scenarioSituation: string | null;
  scenarioAnswer: string | null;
  scenarioActions: string | null;
  quiz: QuizQuestion[] | null;
  imageUrl: string | null;
  imageAlt: string | null;
  videoUrl: string | null;
  shareText: string | null;
};
export type Topic = { id: string; name: string; icon: string };
export type Audience = { id: string; name: string };

type Row = {
  id: string; code: string; type: ContentType; topic_id: string; audience_ids: string[];
  is_sample: boolean; is_core: boolean; lang: string; title: string; summary: string | null;
  body: string | null; scenario_situation: string | null; scenario_answer: string | null;
  scenario_actions: string | null; quiz: QuizQuestion[] | null; image_url: string | null;
  image_alt: string | null; video_url: string | null; share_text: string | null;
};
type NamedRow = { id: string; name_en: string; name_ur: string; icon?: string };

export type AwarenessResult =
  | { status: "ok"; items: ContentItem[]; topics: Topic[]; audiences: Audience[] }
  | { status: "unavailable" };

const name = (lang: Locale, r: NamedRow) => (lang === "ur" ? r.name_ur : r.name_en) || r.name_en;

export async function getAwareness(lang: Locale): Promise<AwarenessResult> {
  if (!supabaseConfigured) return { status: "unavailable" };
  try {
    const [rows, topics, audiences] = await Promise.all([
      callFunction<Row[]>("get_awareness_content", { p_lang: lang }),
      select<NamedRow[]>("topics", "id,name_en,name_ur,icon&order=sort_order"),
      select<NamedRow[]>("audiences", "id,name_en,name_ur&order=sort_order"),
    ]);
    return {
      status: "ok",
      items: rows.map((r) => ({
        id: r.id,
        code: r.code,
        type: r.type,
        topicId: r.topic_id,
        audienceIds: r.audience_ids ?? [],
        isSample: r.is_sample,
        isCore: r.is_core,
        lang: r.lang,
        title: r.title,
        summary: r.summary,
        body: r.body,
        scenarioSituation: r.scenario_situation,
        scenarioAnswer: r.scenario_answer,
        scenarioActions: r.scenario_actions,
        quiz: r.quiz,
        imageUrl: r.image_url,
        imageAlt: r.image_alt,
        videoUrl: r.video_url,
        shareText: r.share_text,
      })),
      topics: topics.map((t) => ({ id: t.id, name: name(lang, t), icon: t.icon ?? "book-open" })),
      audiences: audiences.map((a) => ({ id: a.id, name: name(lang, a) })),
    };
  } catch {
    return { status: "unavailable" };
  }
}

export async function getContentItem(lang: Locale, code: string) {
  const result = await getAwareness(lang);
  if (result.status !== "ok") return { result, item: undefined };
  return { result, item: result.items.find((i) => i.code === code) };
}
