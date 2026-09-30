import { QUICK_EXIT_URL } from "./config";

/**
 * Leave Hifazat immediately.
 * location.replace() swaps the current page out of the tab's history, so the
 * Back button does not return to it.
 */
export function quickExit(): void {
  try {
    sessionStorage.clear();
  } catch {
    // Storage may be blocked; leaving matters more.
  }
  window.location.replace(QUICK_EXIT_URL);
}
