/** Fills {placeholders} in a message, e.g. format("Phase {phase}", { phase: 2 }). */
export function format(message: string, values: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
}
