"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { MapPin } from "lucide-react";
import type { Contact, District } from "@/lib/contacts";
import { ContactCallButton, type CallLabels } from "./ContactCallButton";
import { Card } from "./ui/Card";
import { inputClass, sectionTitleClass } from "./ui/styles";

const STORAGE_KEY = "hifazat.district";

function readSaved(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return ""; // Storage may be blocked; the picker still works.
  }
}
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

type Props = {
  contacts: Contact[];
  districts: District[];
  labels: CallLabels & {
    districtTitle: string;
    districtChoose: string;
    districtPlaceholder: string;
    districtEmpty: string;
    districtPrivacy: string;
  };
};

/** Pick a district to see its numbers. Everything is already on the page, so it works offline. */
export function DistrictNumbers({ contacts, districts, labels }: Props) {
  const selectId = useId();
  // The choice saved earlier in this browser (empty while the page is built on the server).
  const saved = useSyncExternalStore(subscribe, readSaved, () => "");
  const [picked, setPicked] = useState<string | null>(null);
  const district = picked ?? (districts.some((d) => d.id === saved) ? saved : "");

  function choose(value: string) {
    setPicked(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Not saved; that's fine.
    }
  }

  const shown = contacts.filter((c) => c.districtId && c.districtId === district);

  return (
    <Card className="space-y-4">
      <h2 className={`flex items-center gap-2 ${sectionTitleClass}`}>
        <MapPin aria-hidden="true" className="size-5 text-brand" />
        {labels.districtTitle}
      </h2>
      <div>
        <label htmlFor={selectId} className="mb-1.5 block text-[0.9375rem] font-medium text-ink">
          {labels.districtChoose}
        </label>
        <select
          id={selectId}
          value={district}
          onChange={(e) => choose(e.target.value)}
          className={inputClass}
          data-testid="district-select"
        >
          <option value="">{labels.districtPlaceholder}</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-sm text-ink-soft">{labels.districtPrivacy}</p>
      </div>
      {district && (
        <div className="space-y-3" aria-live="polite">
          {shown.length === 0 ? (
            <p className="text-ink-soft">{labels.districtEmpty}</p>
          ) : (
            shown.map((c) => <ContactCallButton key={c.id} contact={c} labels={labels} />)
          )}
        </div>
      )}
    </Card>
  );
}
