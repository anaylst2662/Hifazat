import {
  Baby, BookOpen, CirclePlay, FileText, Footprints, Handshake, HeartCrack, House, Images, Lightbulb,
  ListChecks, Megaphone, MegaphoneOff, MessageCircleQuestionMark, Shield, Smartphone, type LucideIcon,
} from "lucide-react";
import type { Tone } from "../ui/styles";

// Topic icons are stored by name in the database (topics.icon).
const topicIcons: Record<string, LucideIcon> = {
  handshake: Handshake,
  shield: Shield,
  "megaphone-off": MegaphoneOff,
  "heart-crack": HeartCrack,
  house: House,
  footprints: Footprints,
  smartphone: Smartphone,
  baby: Baby,
};
export const topicIcon = (name: string): LucideIcon => topicIcons[name] ?? BookOpen;

export type ContentType = "article" | "infographic" | "video" | "faq" | "scenario" | "quiz" | "campaign";

export const typeLook: Record<ContentType, { icon: LucideIcon; tone: Tone; label: string }> = {
  article: { icon: FileText, tone: "learn", label: "typeArticle" },
  infographic: { icon: Images, tone: "learn", label: "typeInfographic" },
  video: { icon: CirclePlay, tone: "learn", label: "typeVideo" },
  faq: { icon: MessageCircleQuestionMark, tone: "learn", label: "typeFaq" },
  scenario: { icon: Lightbulb, tone: "report", label: "typeScenario" },
  quiz: { icon: ListChecks, tone: "help", label: "typeQuiz" },
  campaign: { icon: Megaphone, tone: "support", label: "typeCampaign" },
};
