import en from "@i18n/en.json";
import urJson from "@i18n/ur.json";
import type { Locale } from "./config";

export type Dictionary = typeof en;

// Type-checked: the build fails if ur.json is missing a key that en.json has.
const ur: Dictionary = urJson;

const dictionaries: Record<Locale, Dictionary> = { en, ur };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

// Kept in its own file so browser-side code can use it without loading every language.
export { format } from "./format";
