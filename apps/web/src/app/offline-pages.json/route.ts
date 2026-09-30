import { locales } from "@/i18n/config";
import { getAwareness } from "@/lib/awareness";

// The list of pages the offline helper (public/sw.js) saves on the phone:
// emergency, safety plan, safety tips, the Learn page, and every learning item
// marked as a "core guide" (is_core) in the database.
export const revalidate = 3600;

export async function GET() {
  const pages: string[] = [];
  for (const lang of locales) {
    pages.push(`/${lang}`, `/${lang}/now`, `/${lang}/plan`, `/${lang}/tips`, `/${lang}/learn`);
    const result = await getAwareness(lang);
    if (result.status === "ok") {
      for (const item of result.items) if (item.isCore) pages.push(`/${lang}/learn/${item.code}`);
    }
  }
  return Response.json({ pages });
}
