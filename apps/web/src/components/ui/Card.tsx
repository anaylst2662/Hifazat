type Props = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  as?: "div" | "li" | "section";
  "data-testid"?: string;
};

/** White card with a thin border: the basic container for content. */
export function Card({ children, className = "", as: Tag = "div", ...rest }: Props) {
  return (
    <Tag
      {...rest}
      className={`rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </Tag>
  );
}
