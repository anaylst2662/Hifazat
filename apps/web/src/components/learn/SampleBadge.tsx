/** Shown on every SAMPLE item so it can never be mistaken for reviewed content. */
export function SampleBadge({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full bg-banner px-2.5 py-0.5 text-xs font-bold tracking-wide text-banner-ink">
      {label}
    </span>
  );
}
