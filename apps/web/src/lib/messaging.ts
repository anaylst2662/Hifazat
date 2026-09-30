// Builds links that open the phone's own SMS or WhatsApp app with a message
// ready to send. Nothing is sent until the person taps "Send" in that app,
// and Hifazat never sees the message.

/** Digits only, with a leading "+" kept, e.g. "0300 123-4567" -> "03001234567". */
export function cleanPhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/[^0-9]/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

/** International digits for WhatsApp. Local Pakistani numbers (0300...) become 92300... */
export function whatsappNumber(phone: string): string {
  const clean = cleanPhone(phone);
  if (clean.startsWith("+")) return clean.slice(1);
  if (clean.startsWith("00")) return clean.slice(2);
  if (clean.startsWith("0")) return `92${clean.slice(1)}`;
  return clean;
}

export function smsLink(phone: string, message: string): string {
  // "?&body=" works on both Android and iPhone.
  return `sms:${cleanPhone(phone)}?&body=${encodeURIComponent(message)}`;
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string): string {
  return `tel:${cleanPhone(phone)}`;
}

/** A map link the contact can open. Only added when the person chooses to share location. */
export function mapLink(latitude: number, longitude: number): string {
  const lat = latitude.toFixed(5);
  const lon = longitude.toFixed(5);
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;
}
