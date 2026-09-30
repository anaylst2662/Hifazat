"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageVisit } from "@/lib/nav-history";

/** Counts page changes inside Hifazat (in memory only) for the Back button. */
export function NavTracker() {
  const pathname = usePathname();
  useEffect(() => {
    recordPageVisit();
  }, [pathname]);
  return null;
}
