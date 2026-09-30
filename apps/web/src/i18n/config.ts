// Languages the app supports. To add Shina or Burushaski later, add the code
// here and a matching file in /shared/i18n.
export const locales = ["en", "ur"] as const;
export type Locale = (typeof locales)[number];

export const rtlLocales: readonly Locale[] = ["ur"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function textDirection(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

/** The other language, for the language switch. */
export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ur" : "en";
}

/** Browser storage key for the visitor's chosen language (a convenience only). */
export const LANGUAGE_STORAGE_KEY = "hifazat.lang";
