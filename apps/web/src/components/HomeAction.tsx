import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  className: string;
  large?: boolean;
};

/** One big, colored button on the home screen: icon + label + short hint. */
export function HomeAction({ href, label, hint, icon: Icon, className, large = false }: Props) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-2xl px-5 shadow-sm transition-transform active:scale-[0.99] ${
        large ? "min-h-28 py-5" : "min-h-20 py-4"
      } ${className}`}
    >
      <Icon aria-hidden="true" className={large ? "size-11 shrink-0" : "size-8 shrink-0"} strokeWidth={2.25} />
      <span className="flex flex-col">
        <span className={`font-bold leading-tight rtl:leading-[2] ${large ? "text-3xl" : "text-2xl"}`}>{label}</span>
        <span className="text-base opacity-95 rtl:mt-1">{hint}</span>
      </span>
    </Link>
  );
}
