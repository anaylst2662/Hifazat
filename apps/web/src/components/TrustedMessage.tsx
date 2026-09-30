"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { MapPin, MessageCircle, MessageSquareText, Users } from "lucide-react";
import { useSafetyPlan } from "@/lib/safety-plan";
import { mapLink, smsLink, whatsappLink } from "@/lib/messaging";
import { format } from "@/i18n/format";
import type { TRUSTED_MESSAGE_TEXT } from "./text-keys";
import { Card } from "./ui/Card";
import { buttonClass, inputClass, sectionTitleClass } from "./ui/styles";


type Text = Record<(typeof TRUSTED_MESSAGE_TEXT)[number], string>;
type Location = { status: "off" } | { status: "locating" } | { status: "failed" } | { status: "found"; link: string };

/**
 * "Message someone you trust": the person picks a contact (from their safety
 * plan on this device), checks the message, optionally adds their location,
 * then opens SMS or WhatsApp and presses Send there. Nothing is sent by Hifazat.
 */
export function TrustedMessage({ text, planHref }: { text: Text; planHref: string }) {
  const { status, plan } = useSafetyPlan();
  const groupId = useId();
  const messageId = useId();
  const [contactId, setContactId] = useState<string>("");
  const [message, setMessage] = useState(text.messageDefault);
  const [location, setLocation] = useState<Location>({ status: "off" });

  const contacts = plan.trustedContacts;
  // The first contact is chosen until the person picks another.
  const selectedId = contacts.some((c) => c.id === contactId) ? contactId : (contacts[0]?.id ?? "");

  function toggleLocation(on: boolean) {
    if (!on) return setLocation({ status: "off" });
    if (!("geolocation" in navigator)) return setLocation({ status: "failed" });
    setLocation({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ status: "found", link: mapLink(pos.coords.latitude, pos.coords.longitude) }),
      () => setLocation({ status: "failed" }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

  const contact = contacts.find((c) => c.id === selectedId);
  const fullMessage =
    location.status === "found" ? `${message}\n${format(text.messageLocationLine, { link: location.link })}` : message;

  return (
    <Card className="space-y-4" data-testid="trusted-message">
      <h2 className={`flex items-center gap-2 ${sectionTitleClass}`}>
        <Users aria-hidden="true" className="size-5 text-brand" />
        {text.messageTitle}
      </h2>

      {status === "ready" && contacts.length === 0 && (
        <div className="space-y-3">
          <p className="text-ink-soft">{text.messageNoContacts}</p>
          <Link href={planHref} className={buttonClass("secondary")}>
            {text.planTitle}
          </Link>
        </div>
      )}

      {status === "ready" && contacts.length > 0 && (
        <>
          <fieldset>
            <legend id={groupId} className="mb-2 text-[0.9375rem] font-medium text-ink">
              {text.messageChooseContact}
            </legend>
            <div className="space-y-2">
              {contacts.map((c) => (
                <label
                  key={c.id}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 ${
                    c.id === selectedId ? "border-brand bg-brand-soft" : "border-line bg-surface"
                  }`}
                >
                  <input
                    type="radio"
                    name={groupId}
                    value={c.id}
                    checked={c.id === selectedId}
                    onChange={() => setContactId(c.id)}
                    className="size-5 accent-[var(--color-brand)]"
                  />
                  <span className="font-medium text-ink">{c.name}</span>
                  <span dir="ltr" className="ms-auto text-sm text-ink-soft tabular-nums">
                    {c.phone}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor={messageId} className="mb-1.5 block text-[0.9375rem] font-medium text-ink">
              {text.messageLabel}
            </label>
            <textarea
              id={messageId}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="rounded-xl bg-bg p-3">
            <label className="flex min-h-12 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={location.status !== "off"}
                onChange={(e) => toggleLocation(e.target.checked)}
                className="size-5 accent-[var(--color-brand)]"
                data-testid="add-location"
              />
              <MapPin aria-hidden="true" className="size-5 text-brand" />
              <span className="font-medium text-ink">{text.messageAddLocation}</span>
            </label>
            <p className="text-sm text-ink-soft" aria-live="polite">
              {location.status === "locating"
                ? text.messageLocating
                : location.status === "failed"
                  ? text.messageLocationFailed
                  : text.messageLocationHint}
            </p>
          </div>

          {contact && (
            <div className="grid gap-2 sm:grid-cols-2">
              <a href={smsLink(contact.phone, fullMessage)} className={buttonClass("primary")} data-testid="send-sms">
                <MessageSquareText aria-hidden="true" className="size-5" />
                {text.messageSendSms}
              </a>
              <a
                href={whatsappLink(contact.phone, fullMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("secondary")}
                data-testid="send-whatsapp"
              >
                <MessageCircle aria-hidden="true" className="size-5" />
                {text.messageSendWhatsapp}
              </a>
            </div>
          )}
          <p className="text-sm text-ink-soft">{text.messageConfirmNote}</p>
        </>
      )}
    </Card>
  );
}
