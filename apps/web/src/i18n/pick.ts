import type { Dictionary } from "./dictionaries";

/** Picks only the texts a browser-side component needs, so pages stay small. */
export function pickText<K extends keyof Dictionary>(dict: Dictionary, keys: readonly K[]): Pick<Dictionary, K> {
  return Object.fromEntries(keys.map((k) => [k, dict[k]])) as Pick<Dictionary, K>;
}
