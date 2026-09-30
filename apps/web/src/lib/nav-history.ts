// Remembers (in memory only, never saved) whether the visitor has moved
// between Hifazat pages in this tab, so "Back" knows whether it can go back
// inside Hifazat or should go to the home page.
let pagesVisited = 0;

export function recordPageVisit(): void {
  pagesVisited += 1;
}

export function hasPreviousHifazatPage(): boolean {
  return pagesVisited > 1;
}
