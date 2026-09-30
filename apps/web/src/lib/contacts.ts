import "server-only";
import type { Locale } from "@/i18n/config";
import { callFunction, select, supabaseConfigured } from "./supabase-rest";

// Shapes returned by the database (see supabase/migrations/*_protect_contact_numbers.sql).
type ContactRow = {
  id: string;
  kind: "emergency" | "helpline" | "organization";
  label_en: string;
  label_ur: string;
  description_en: string | null;
  description_ur: string | null;
  phone: string;
  district_id: string | null;
  hours_en: string | null;
  hours_ur: string | null;
  is_24h: boolean;
  is_placeholder: boolean;
  verified_at: string | null;
};
type DistrictRow = { id: string; name_en: string; name_ur: string };

/** A contact number, already in the visitor's language. */
export type Contact = {
  id: string;
  kind: ContactRow["kind"];
  label: string;
  description: string | null;
  phone: string;
  districtId: string | null;
  hours: string | null;
  is24h: boolean;
  isPlaceholder: boolean;
};
export type District = { id: string; name: string };

export type ContactsResult =
  | { status: "ok"; contacts: Contact[]; districts: District[] }
  | { status: "unavailable" };

const pick = (lang: Locale, en: string | null, ur: string | null) => (lang === "ur" ? ur || en : en);

export async function getContacts(lang: Locale): Promise<ContactsResult> {
  if (!supabaseConfigured) return { status: "unavailable" };
  try {
    const [rows, districtRows] = await Promise.all([
      callFunction<ContactRow[]>("get_emergency_contacts"),
      select<DistrictRow[]>("districts", "id,name_en,name_ur&order=sort_order"),
    ]);
    return {
      status: "ok",
      contacts: rows.map((r) => ({
        id: r.id,
        kind: r.kind,
        label: pick(lang, r.label_en, r.label_ur) ?? r.label_en,
        description: pick(lang, r.description_en, r.description_ur),
        phone: r.phone,
        districtId: r.district_id,
        hours: pick(lang, r.hours_en, r.hours_ur),
        is24h: r.is_24h,
        isPlaceholder: r.is_placeholder,
      })),
      districts: districtRows.map((d) => ({ id: d.id, name: (lang === "ur" ? d.name_ur : d.name_en) || d.name_en })),
    };
  } catch {
    return { status: "unavailable" };
  }
}
