import Link from "next/link";
import { ChevronRight, Siren } from "lucide-react";
import { pressable } from "./ui/styles";

type Props = { href: string; label: string; hint: string };

/** The most prominent option on the home screen. The only red element. */
export function DangerCard({ href, label, hint }: Props) {
  return (
    <Link
      href={href}
      data-testid="danger-card"
      className={`flex min-h-24 items-center gap-4 rounded-[var(--radius-card)] bg-danger p-5 text-white shadow-[var(--shadow-danger)] hover:bg-[#b82424] ${pressable}`}
    >
      <span aria-hidden="true" className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-white/20">
        <Siren className="size-7" strokeWidth={2} />
      </span>
      <span className="flex-1">
        <span className="block text-[1.375rem] font-bold leading-tight rtl:leading-[2]">{label}</span>
        <span className="mt-1 block text-[0.9375rem] text-white/90">{hint}</span>
      </span>
      <ChevronRight aria-hidden="true" className="size-6 shrink-0 rtl:rotate-180" />
    </Link>
  );
}
