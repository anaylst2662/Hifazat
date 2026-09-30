import type { LucideIcon } from "lucide-react";
import { toneClass, type Tone } from "./styles";

type Props = { icon: LucideIcon; tone: Tone; size?: "md" | "lg" };

/** A rounded square with an icon, tinted in a pillar color. Decorative only. */
export function IconBadge({ icon: Icon, tone, size = "md" }: Props) {
  const box = size === "lg" ? "size-14 rounded-2xl" : "size-12 rounded-2xl";
  const glyph = size === "lg" ? "size-7" : "size-6";
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center ${box} ${toneClass[tone]}`}>
      <Icon className={glyph} strokeWidth={2} />
    </span>
  );
}
