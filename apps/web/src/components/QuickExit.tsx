"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { QUICK_EXIT_ESC_PRESSES, QUICK_EXIT_ESC_WINDOW_MS } from "@/lib/config";
import { quickExit } from "@/lib/quick-exit";

type Props = { label: string; ariaLabel: string };

/** The Quick Exit button, plus the "press Esc 3 times" keyboard shortcut. */
export function QuickExit({ label, ariaLabel }: Props) {
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
      className="inline-flex min-h-12 items-center gap-2 rounded-full bg-exit whitespace-nowrap px-4 py-2 text-base font-bold text-white shadow-md hover:bg-black"
    >
      <X aria-hidden="true" className="size-5" strokeWidth={3} />
      <span>{label}</span>
    </button>
  );
}
