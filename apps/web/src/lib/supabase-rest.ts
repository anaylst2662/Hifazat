import "server-only";

// Minimal, dependency-free access to Supabase's public REST API, used on the
// SERVER while building pages. Visitors' phones never contact Supabase for
// these pages, and only the public (anon) key is used.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

/** How often (seconds) pages re-check Supabase for updated numbers. */
export const REFRESH_SECONDS = 3600;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!url || !anonKey) throw new Error("Supabase is not configured");
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    next: { revalidate: REFRESH_SECONDS },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
  return (await response.json()) as T;
}

/** Calls a database function (e.g. get_emergency_contacts). */
export function callFunction<T>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  return request<T>(`rpc/${name}`, { method: "POST", body: JSON.stringify(args) });
}

/** Reads rows from a table, e.g. select("districts", "id,name_en&order=sort_order"). */
export function select<T>(table: string, query: string): Promise<T> {
  return request<T>(`${table}?select=${query}`);
}
