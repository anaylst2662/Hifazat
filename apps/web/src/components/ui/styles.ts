// Shared class names for the design system, so every page looks the same.

/** Gentle press feedback. Switched off automatically for "reduce motion". */
export const pressable = "transition duration-150 ease-out active:scale-[0.98]";

export type ButtonVariant = "primary" | "secondary" | "danger" | "onBrand" | "onBrandSolid";

const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-base font-semibold " +
  pressable;

const buttonVariants: Record<ButtonVariant, string> = {
  // Main action
  primary: "bg-brand text-white hover:bg-[#0f2747]",
  // Quiet action (e.g. Back)
  secondary: "border border-line bg-surface text-ink hover:border-ink-soft",
  // Emergency actions only
  danger: "bg-danger text-white hover:bg-[#ad2222]",
  // Outlined button on the navy header
  onBrand: "border border-white/45 text-white hover:bg-white/10 focus-visible:outline-white",
  // Solid white button on the navy header (Quick Exit)
  onBrandSolid: "bg-white text-brand shadow-sm hover:bg-brand-soft focus-visible:outline-white",
};

export function buttonClass(variant: ButtonVariant, extra = ""): string {
  return `${buttonBase} ${buttonVariants[variant]} ${extra}`;
}

export type Tone = "brand" | "danger" | "learn" | "help" | "report" | "support";

/** Soft tinted background + strong foreground, for icon badges. */
export const toneClass: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand",
  danger: "bg-danger-soft text-danger",
  learn: "bg-learn-soft text-learn",
  help: "bg-help-soft text-help",
  report: "bg-report-soft text-report",
  support: "bg-support-soft text-support",
};
