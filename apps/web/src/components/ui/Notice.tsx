import { AlertTriangle, Info, type LucideIcon } from "lucide-react";

type Props = { children: React.ReactNode; tone?: "info" | "danger"; icon?: LucideIcon; title?: string };

/** A calm message box: "info" (navy tint) or "danger" (soft red, emergencies only). */
export function Notice({ children, tone = "info", icon, title }: Props) {
  const Icon = icon ?? (tone === "danger" ? AlertTriangle : Info);
  const look =
    tone === "danger" ? "border-danger/30 bg-danger-soft" : "border-transparent bg-brand-soft";
  const iconColor = tone === "danger" ? "text-danger" : "text-brand";
  return (
    <div className={`flex gap-3 rounded-[var(--radius-card)] border p-4 ${look}`}>
      <Icon aria-hidden="true" className={`mt-1 size-5 shrink-0 ${iconColor}`} strokeWidth={2.25} />
      <div className="text-base text-ink">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-1 text-ink-soft" : ""}>{children}</div>
      </div>
    </div>
  );
}
