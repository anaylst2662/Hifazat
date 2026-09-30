import Link from "next/link";
import { LANGUAGE_STORAGE_KEY } from "@/i18n/config";

// Sends the visitor to their language: Urdu only if they chose it before
// (remembered in this browser); otherwise English. The phone's language is
// deliberately NOT used. Works offline too, because it runs in the browser.
const chooseLanguage = `
(function () {
  var lang = "en";
  try { if (localStorage.getItem(${JSON.stringify(LANGUAGE_STORAGE_KEY)}) === "ur") lang = "ur"; } catch (e) {}
  location.replace("/" + lang);
})();
`;

export default function EntryPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <script dangerouslySetInnerHTML={{ __html: chooseLanguage }} />
      {/* Shown only if the browser does not run scripts. */}
      <p className="text-2xl font-bold text-brand">Hifazat</p>
      <Link href="/en" className="w-full rounded-full bg-brand px-6 py-3 text-lg font-semibold text-white">
        English
      </Link>
      <Link href="/ur" lang="ur" className="w-full rounded-full border border-line bg-surface px-6 py-3 text-lg font-semibold text-ink">
        اردو
      </Link>
    </main>
  );
}
