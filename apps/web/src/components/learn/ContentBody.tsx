/**
 * Shows content text safely (never as HTML). Rules for writers:
 * a blank line starts a new paragraph; lines starting with "- " become a list.
 */
export function ContentBody({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`space-y-4 text-ink ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim());
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand rtl:mt-[1em]" />
                  <span>{l.slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{lines.join(" ")}</p>;
      })}
    </div>
  );
}
