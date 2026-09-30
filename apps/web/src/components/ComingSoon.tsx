import { Hammer } from "lucide-react";
import { format, type Dictionary } from "@/i18n/dictionaries";

type Props = { dict: Dictionary; phase: number; children?: React.ReactNode };

/** Placeholder for sections that are built in later phases. */
export function ComingSoon({ dict, phase, children }: Props) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-line bg-card p-6">
      <p className="flex items-center gap-3 text-xl font-bold">
        <Hammer aria-hidden="true" className="size-6 shrink-0 text-ink-soft" />
        {dict.comingSoonTitle}
      </p>
      <p className="mt-2 text-ink-soft">{dict.comingSoonBody}</p>
      <p className="mt-1 text-ink-soft">{format(dict.comingSoonPhase, { phase })}</p>
      {children}
    </div>
  );
}
