import Link from "next/link";
import { LANGUAGE_STORAGE_KEY } from "@/i18n/config";

// Sends the visitor to their language: their earlier choice if saved,
// otherwise Urdu if their phone is set to Urdu, otherwise English.
// Works offline too, because it runs in the browser.
const chooseLanguage = `
(function () {
  var lang = null;
  try { lang = localStorage.getItem(${JSON.stringify(LANGUAGE_STORAGE_KEY)}); } catch (e) {}
  if (lang !== "en" && lang !== "ur") {
    var prefs = navigator.languages || [navigator.language || ""];
    lang = prefs.some(function (l) { return /^ur/i.test(l); }) ? "ur" : "en";
  }
  location.replace("/" + lang);
})();
`;

export default function EntryPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <script dangerouslySetInnerHTML={{ __html: chooseLanguage }} />
      {/* Shown only if the browser does not run scripts. */}
      <p className="text-2xl font-bold">Hifazat · حفاظت</p>
      <Link href="/en" className="w-full rounded-2xl bg-brand px-6 py-4 text-xl font-bold text-white">
        English
      </Link>
      <Link href="/ur" lang="ur" className="w-full rounded-2xl bg-brand px-6 py-4 text-xl font-bold text-white">
        اردو
      </Link>
    </main>
  );
}
