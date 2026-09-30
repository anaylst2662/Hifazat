import { Clock, Phone } from "lucide-react";
import type { Contact } from "@/lib/contacts";
import { telLink } from "@/lib/messaging";
import { format } from "@/i18n/format";
import { pressable } from "./ui/styles";

export type CallLabels = { callAria: string; available24h: string; placeholderBadge: string };

type Props = { contact: Contact; labels: CallLabels };

/**
 * One tap-to-call button. Emergency numbers are red (the only red on the page
 * besides warnings); helplines are calm white cards.
 */
export function ContactCallButton({ contact, labels }: Props) {
  const emergency = contact.kind === "emergency";
  const aria = format(labels.callAria, { name: contact.label, phone: contact.phone });
  return (
    <a
      href={telLink(contact.phone)}
      aria-label={aria}
      data-testid="call-button"
      data-kind={contact.kind}
      className={`flex min-h-20 items-center gap-4 rounded-[var(--radius-card)] p-4 ${pressable} ${
        emergency
          ? "bg-danger text-white shadow-[var(--shadow-danger)] hover:bg-[#b82424]"
          : "border border-line bg-surface text-ink shadow-[var(--shadow-card)] hover:border-ink-soft/40"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full ${
          emergency ? "bg-white/20" : "bg-brand-soft text-brand"
        }`}
      >
        <Phone className="size-6" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-semibold leading-snug rtl:leading-[2]">{contact.label}</span>
        <span className={`mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem] ${emergency ? "text-white/90" : "text-ink-soft"}`}>
          <span dir="ltr" className="font-semibold tabular-nums">
            {contact.phone}
          </span>
          {(contact.is24h || contact.hours) && (
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="size-4" />
              {contact.is24h ? labels.available24h : contact.hours}
            </span>
          )}
        </span>
        {contact.isPlaceholder && (
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide ${
              emergency ? "bg-white text-danger" : "bg-banner text-banner-ink"
            }`}
          >
            {labels.placeholderBadge}
          </span>
        )}
      </span>
    </a>
  );
}
