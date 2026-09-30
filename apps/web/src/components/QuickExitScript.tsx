import { QUICK_EXIT_ESC_PRESSES, QUICK_EXIT_ESC_WINDOW_MS, QUICK_EXIT_URL } from "@/lib/config";

// Quick Exit must work the moment the page appears, even on a slow phone
// before the rest of the app's code has loaded. This tiny script runs first
// and handles both the Quick Exit button (any element with data-quick-exit)
// and the "press Esc 3 times" shortcut.
// location.replace() swaps the current page out of the tab's history, so the
// Back button does not return to it.
const script = `(function () {
  var url = ${JSON.stringify(QUICK_EXIT_URL)};
  function leave() {
    try { sessionStorage.clear(); } catch (e) {}
    location.replace(url);
  }
  document.addEventListener("click", function (event) {
    var target = event.target && event.target.closest && event.target.closest("[data-quick-exit]");
    if (target) { event.preventDefault(); leave(); }
  }, true);
  var presses = [];
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var now = Date.now();
    presses = presses.filter(function (t) { return now - t < ${QUICK_EXIT_ESC_WINDOW_MS}; });
    presses.push(now);
    if (presses.length >= ${QUICK_EXIT_ESC_PRESSES}) leave();
  }, true);
})();`;

export function QuickExitScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
