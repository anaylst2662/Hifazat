"use client";

import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { QUICK_EXIT_ESC_PRESSES, QUICK_EXIT_ESC_WINDOW_MS } from "@/lib/config";
import { quickExit } from "@/lib/quick-exit";
import { buttonClass } from "./ui/styles";

type Props = { label: string; ariaLabel: string };

/** Quick Exit: a clear white button in the header, plus "press Esc 3 times". */
export function QuickExitButton({ label, ariaLabel }: Props) {
  useEffect(() => {
    let presses: number[] = [];
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const now = Date.now();
      presses = [...presses.filter((t) => now - t < QUICK_EXIT_ESC_WINDOW_MS), now];
      if (presses.length >= QUICK_EXIT_ESC_PRESSES) quickExit();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <button
      type="button"
      onClick={quickExit}
      aria-label={ariaLabel}
      data-testid="quick-exit"
      className={buttonClass("onBrandSolid", "px-4")}
    >
      <LogOut aria-hidden="true" className="size-[18px] rtl:-scale-x-100" strokeWidth={2.25} />
      <span>{label}</span>
    </button>
  );
}
