import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { IconBadge } from "./ui/IconBadge";
import { pressable, type Tone } from "./ui/styles";

type Props = { href: string; label: string; hint: string; icon: LucideIcon; tone: Tone };

/** One of the four home-screen tiles: icon, title, one short line. */
export function ActionTile({ href, label, hint, icon, tone }: Props) {
  return (
    <Link
      href={href}
      className={`flex min-h-40 flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[var(--shadow-card)] hover:border-ink-soft/40 hover:shadow-[var(--shadow-raised)] ${pressable}`}
    >
      <IconBadge icon={icon} tone={tone} />
      <span>
        <span className="block text-[1.0625rem] font-semibold leading-snug text-ink rtl:leading-[2]">{label}</span>
        <span className="mt-1 block text-[0.9375rem] leading-snug text-ink-soft rtl:leading-[2]">{hint}</span>
      </span>
    </Link>
  );
}
