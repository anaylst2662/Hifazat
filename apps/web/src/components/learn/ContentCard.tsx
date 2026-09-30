import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { IconBadge } from "../ui/IconBadge";
import { pressable } from "../ui/styles";
import { SampleBadge } from "./SampleBadge";
import { typeLook, type ContentType } from "./icons";

export type CardItem = { code: string; type: ContentType; title: string; summary: string | null; isSample: boolean };

type Props = { item: CardItem; href: string; typeLabel: string; sampleLabel: string };

/** A card linking to one piece of learning content. */
export function ContentCard({ item, href, typeLabel, sampleLabel }: Props) {
  const look = typeLook[item.type];
  return (
    <Link
      href={href}
      data-testid="content-card"
      className={`flex items-start gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[var(--shadow-card)] hover:border-ink-soft/40 hover:shadow-[var(--shadow-raised)] ${pressable}`}
    >
      <IconBadge icon={look.icon} tone={look.tone} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink-soft">{typeLabel}</span>
        <span className="block text-[1.0625rem] font-semibold leading-snug text-ink rtl:leading-[2]">{item.title}</span>
        {item.summary && <span className="mt-1 block text-[0.9375rem] leading-snug text-ink-soft rtl:leading-[2]">{item.summary}</span>}
        {item.isSample && (
          <span className="mt-2 block">
            <SampleBadge label={sampleLabel} />
          </span>
        )}
      </span>
      <ChevronRight aria-hidden="true" className="mt-3 size-5 shrink-0 text-ink-soft rtl:rotate-180" />
    </Link>
  );
}
