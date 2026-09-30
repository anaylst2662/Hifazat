type Props = { children: React.ReactNode; className?: string; as?: "div" | "li" | "section" };

/** White card with a thin border: the basic container for content. */
export function Card({ children, className = "", as: Tag = "div" }: Props) {
  return (
    <Tag className={`rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] ${className}`}>
      {children}
    </Tag>
  );
}
