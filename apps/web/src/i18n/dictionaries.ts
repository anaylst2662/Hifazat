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

/** Fills {placeholders} in a message, e.g. format("Phase {phase}", { phase: 2 }). */
export function format(message: string, values: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}
