import { Hammer } from "lucide-react";
import { format, type Dictionary } from "@/i18n/dictionaries";
import { Card } from "./ui/Card";
import { IconBadge } from "./ui/IconBadge";

type Props = { dict: Dictionary; phase: number };

/** Placeholder for sections built in later phases. */
export function ComingSoon({ dict, phase }: Props) {
  return (
    <Card className="flex gap-4">
      <IconBadge icon={Hammer} tone="brand" />
      <div>
        <p className="text-lg font-semibold text-ink">{dict.comingSoonTitle}</p>
        <p className="mt-1 text-ink-soft">{dict.comingSoonBody}</p>
        <p className="mt-1 text-sm font-medium text-ink-soft">{format(dict.comingSoonPhase, { phase })}</p>
      </div>
    </Card>
  );
}
