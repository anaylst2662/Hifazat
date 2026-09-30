import { LogOut } from "lucide-react";
import { QUICK_EXIT_URL } from "@/lib/config";
import { buttonClass } from "./ui/styles";

type Props = { label: string; ariaLabel: string };

/**
 * The Quick Exit button. It is a plain link to the neutral site, so it works
 * even without any code; QuickExitScript upgrades it to replace the page in
 * the history as soon as the page appears.
 */
export function QuickExitButton({ label, ariaLabel }: Props) {
  return (
    <a
      href={QUICK_EXIT_URL}
      rel="noreferrer"
      data-quick-exit=""
      aria-label={ariaLabel}
      data-testid="quick-exit"
      className={buttonClass("onBrandSolid", "px-4")}
    >
      <LogOut aria-hidden="true" className="size-[18px] rtl:-scale-x-100" strokeWidth={2.25} />
      <span>{label}</span>
    </a>
  );
}
