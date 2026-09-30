"use client";

import { useState, type CSSProperties } from "react";
import {
  BookOpen,
  ChevronRight,
  FileText,
  HeartHandshake,
  Info,
  LifeBuoy,
  LogOut,
  Phone,
  ShieldCheck,
  Siren,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// TEMPORARY: three visual directions for the founder to compare on a phone.
// Nothing here is used by the real pages yet.
// ---------------------------------------------------------------------------

type Tone = { bg: string; fg: string };
type Direction = {
  id: "A" | "B" | "C";
  name: string;
  mood: string;
  fontVar: string;
  fontName: string;
  layout: "list" | "banner" | "grid";
  card: "shadow" | "tint" | "border";
  radius: string;
  colors: {
    bg: string;
    surface: string;
    ink: string;
    inkSoft: string;
    line: string;
    brand: string;
    brandInk: string;
    brandSoft: string;
    danger: string;
    exitBg: string;
    exitFg: string;
  };
  pillars: { learn: Tone; help: Tone; report: Tone; support: Tone };
};

const directions: Direction[] = [
  {
    id: "A",
    name: "Calm Care",
    mood: "Quiet and reassuring, like a trusted health service. Lots of white space, soft teal, gentle shadows.",
    fontVar: "var(--font-a)",
    fontName: "Inter",
    layout: "list",
    card: "shadow",
    radius: "18px",
    colors: {
      bg: "#F3F7F6",
      surface: "#FFFFFF",
      ink: "#15302B",
      inkSoft: "#4A5F5A",
      line: "#DCE7E4",
      brand: "#0B6E66",
      brandInk: "#FFFFFF",
      brandSoft: "#E1F0ED",
      danger: "#C0282D",
      exitBg: "#15302B",
      exitFg: "#FFFFFF",
    },
    pillars: {
      learn: { bg: "#E4F3EA", fg: "#1D6A43" },
      help: { bg: "#E5EEF9", fg: "#1E5A96" },
      report: { bg: "#FCF1D8", fg: "#855600" },
      support: { bg: "#EEEAF9", fg: "#5A43A0" },
    },
  },
  {
    id: "B",
    name: "Warm Community",
    mood: "Friendly and human. Warm cream background, rounded font, soft pastel cards, a deep plum brand color.",
    fontVar: "var(--font-b)",
    fontName: "Nunito Sans",
    layout: "banner",
    card: "tint",
    radius: "24px",
    colors: {
      bg: "#FBF6F0",
      surface: "#FFFFFF",
      ink: "#2B2233",
      inkSoft: "#5C5366",
      line: "#EADFD3",
      brand: "#5A3D8A",
      brandInk: "#FFFFFF",
      brandSoft: "#EFE8F8",
      danger: "#BF2D2D",
      exitBg: "#2B2233",
      exitFg: "#FFFFFF",
    },
    pillars: {
      learn: { bg: "#E6F2E8", fg: "#2A6B45" },
      help: { bg: "#E4EDF8", fg: "#255E9C" },
      report: { bg: "#FBEFD5", fg: "#8A5700" },
      support: { bg: "#F8E7EE", fg: "#963E63" },
    },
  },
  {
    id: "C",
    name: "Modern Trust",
    mood: "Confident and polished, like a well-funded organization. Deep navy header, crisp white tiles in a grid.",
    fontVar: "var(--font-c)",
    fontName: "Plus Jakarta Sans",
    layout: "grid",
    card: "border",
    radius: "16px",
    colors: {
      bg: "#F3F5F9",
      surface: "#FFFFFF",
      ink: "#101B2D",
      inkSoft: "#4F5D75",
      line: "#DFE5EE",
      brand: "#14325A",
      brandInk: "#FFFFFF",
      brandSoft: "#E6EDF7",
      danger: "#C62828",
      exitBg: "#FFFFFF",
      exitFg: "#14325A",
    },
    pillars: {
      learn: { bg: "#E3F4EC", fg: "#1A6E4C" },
      help: { bg: "#E5EDFA", fg: "#1D57A3" },
      report: { bg: "#FFF3D6", fg: "#865A00" },
      support: { bg: "#EEE9FB", fg: "#5E46A8" },
    },
  },
];

type Action = { key: keyof Direction["pillars"]; icon: LucideIcon; title: string; hint: string; ur: string; urHint: string };
const actions: Action[] = [
  { key: "learn", icon: BookOpen, title: "Learn & Stay Safe", hint: "Your rights and your options", ur: "سیکھیں اور محفوظ رہیں", urHint: "اپنے حقوق اور اپنے راستے" },
  { key: "help", icon: LifeBuoy, title: "I Need Help", hint: "Find verified support services", ur: "مجھے مدد چاہیے", urHint: "تصدیق شدہ مددگار ادارے" },
  { key: "report", icon: FileText, title: "I Want to Report", hint: "Anonymous or confidential", ur: "رپورٹ درج کریں", urHint: "گمنام یا رازدارانہ" },
  { key: "support", icon: HeartHandshake, title: "I'm Supporting Someone", hint: "Help someone you care about", ur: "کسی کا ساتھ دینا", urHint: "اپنے کسی عزیز کی مدد" },
];

function vars(d: Direction): CSSProperties {
  const c = d.colors;
  return {
    "--bg": c.bg,
    "--surface": c.surface,
    "--ink": c.ink,
    "--ink-soft": c.inkSoft,
    "--line": c.line,
    "--brand": c.brand,
    "--brand-ink": c.brandInk,
    "--brand-soft": c.brandSoft,
    "--danger": c.danger,
    "--exit-bg": c.exitBg,
    "--exit-fg": c.exitFg,
    "--radius": d.radius,
    fontFamily: `${d.fontVar}, system-ui, sans-serif`,
  } as CSSProperties;
}

const cardLook = {
  shadow: "bg-[var(--surface)] shadow-[0_1px_2px_rgba(16,40,35,0.06),0_4px_14px_rgba(16,40,35,0.06)]",
  tint: "",
  border: "bg-[var(--surface)] border border-[var(--line)]",
};

const press = "transition duration-150 ease-out active:scale-[0.985] motion-reduce:transition-none";

// --- Small shared pieces --------------------------------------------------

function Header({ d, urdu = false }: { d: Direction; urdu?: boolean }) {
  const onBrand = d.layout === "grid";
  return (
    <div
      className={`flex items-center justify-between gap-2 px-4 py-3 ${onBrand ? "bg-[var(--brand)]" : "bg-[var(--surface)] border-b border-[var(--line)]"}`}
    >
      <span className={`inline-flex items-center gap-2 text-lg font-semibold ${onBrand ? "text-white" : "text-[var(--brand)]"}`}>
        <ShieldCheck aria-hidden className="size-6" strokeWidth={2} />
        {urdu ? <span style={{ fontFamily: "var(--font-nastaliq)" }}>حفاظت</span> : "Hifazat"}
      </span>
      <span className="flex items-center gap-2">
        <span
          className={`inline-flex min-h-11 items-center rounded-full px-3.5 text-[15px] font-medium ${
            onBrand ? "border border-white/40 text-white" : "border border-[var(--line)] text-[var(--ink)]"
          }`}
          style={urdu ? undefined : { fontFamily: "var(--font-nastaliq)", lineHeight: 1.6 }}
        >
          {urdu ? "English" : "اردو"}
        </span>
        <span
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[var(--exit-bg)] px-3.5 text-[15px] font-semibold text-[var(--exit-fg)]"
          style={urdu ? { fontFamily: "var(--font-nastaliq)", lineHeight: 1.6 } : undefined}
        >
          <LogOut aria-hidden className="size-4 rtl:-scale-x-100" strokeWidth={2.25} />
          {urdu ? "فوری باہر نکلیں" : "Quick Exit"}
        </span>
      </span>
    </div>
  );
}

function DangerPanel({ urdu = false }: { urdu?: boolean }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-[var(--radius)] bg-[var(--danger)] p-5 text-white shadow-[0_6px_18px_rgba(160,30,30,0.22)] ${press}`}
    >
      <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-white/18">
        <Siren aria-hidden className="size-7" strokeWidth={2} />
      </span>
      <span className="flex-1">
        <span className="block text-[22px] font-bold leading-tight" style={urdu ? { lineHeight: 2 } : undefined}>
          {urdu ? "میں خطرے میں ہوں" : "I'm in Danger"}
        </span>
        <span className="mt-0.5 block text-[15px] text-white/90" style={urdu ? { lineHeight: 2 } : undefined}>
          {urdu ? "ہنگامی نمبر اور فوری اقدامات" : "Emergency numbers and quick steps"}
        </span>
      </span>
      <ChevronRight aria-hidden className="size-6 shrink-0 opacity-90 rtl:rotate-180" />
    </div>
  );
}

function ActionCard({ d, a, urdu = false }: { d: Direction; a: Action; urdu?: boolean }) {
  const tone = d.pillars[a.key];
  const Icon = a.icon;
  const tinted = d.card === "tint";
  const grid = d.layout === "grid";
  return (
    <div
      className={`rounded-[var(--radius)] ${cardLook[d.card]} ${press} ${grid ? "flex min-h-40 flex-col gap-3 p-4" : "flex min-h-[76px] items-center gap-4 px-4 py-3.5"}`}
      style={tinted ? { background: tone.bg } : undefined}
    >
      <span
        className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: tinted ? "#FFFFFF" : tone.bg, color: tone.fg }}
      >
        <Icon aria-hidden className="size-6" strokeWidth={2} />
      </span>
      <span className="flex-1">
        <span
          className="block text-[17px] font-semibold leading-snug text-[var(--ink)]"
          style={urdu ? { lineHeight: 2 } : undefined}
        >
          {urdu ? a.ur : a.title}
        </span>
        <span className="mt-0.5 block text-[14.5px] leading-snug text-[var(--ink-soft)]" style={urdu ? { lineHeight: 2 } : undefined}>
          {urdu ? a.urHint : a.hint}
        </span>
      </span>
      {!grid && <ChevronRight aria-hidden className="size-5 shrink-0 text-[var(--ink-soft)] rtl:rotate-180" />}
    </div>
  );
}

// --- The home screen mock-up ----------------------------------------------

function HomeMock({ d }: { d: Direction }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--bg)] shadow-xl">
      <Header d={d} />
      {d.layout === "grid" && (
        <div className="bg-[var(--brand)] px-5 pb-16 pt-4 text-white">
          <p className="text-[15px] text-white/80">Don&apos;t let fear silence you.</p>
          <h2 className="mt-1 text-[26px] font-bold leading-tight">What do you need right now?</h2>
        </div>
      )}
      <div className={`space-y-4 px-4 pb-6 ${d.layout === "grid" ? "-mt-12" : "pt-5"}`}>
        {d.layout === "list" && (
          <div className="px-1">
            <p className="text-[15px] font-medium text-[var(--brand)]">Don&apos;t let fear silence you.</p>
            <h2 className="mt-1 text-[26px] font-bold leading-tight text-[var(--ink)]">What do you need right now?</h2>
          </div>
        )}
        {d.layout === "banner" && (
          <div className="rounded-[var(--radius)] bg-[var(--brand-soft)] p-5">
            <p className="text-[15px] font-semibold text-[var(--brand)]">You are not alone.</p>
            <h2 className="mt-1 text-[26px] font-extrabold leading-tight text-[var(--ink)]">What do you need right now?</h2>
            <p className="mt-2 text-[15px] text-[var(--ink-soft)]">Choose one. You can leave at any time with Quick Exit.</p>
          </div>
        )}

        <DangerPanel />

        {d.layout === "list" && (
          <p className="px-1 pt-1 text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Other options</p>
        )}
        <div className={d.layout === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"}>
          {actions.map((a) => (
            <ActionCard key={a.key} d={d} a={a} />
          ))}
        </div>

        <p className="flex items-center justify-center gap-1.5 pt-2 text-[14px] text-[var(--ink-soft)]">
          <ShieldCheck aria-hidden className="size-4" /> Staying safe online
        </p>
      </div>
    </div>
  );
}

function UrduMock({ d }: { d: Direction }) {
  return (
    <div
      dir="rtl"
      lang="ur"
      className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--bg)] shadow-xl"
      style={{ fontFamily: "var(--font-nastaliq), serif" }}
    >
      <Header d={d} urdu />
      <div className="space-y-4 px-4 pb-6 pt-5">
        <h2 className="text-[24px] font-bold text-[var(--ink)]" style={{ lineHeight: 2 }}>
          آپ کو ابھی کس چیز کی ضرورت ہے؟
        </h2>
        <DangerPanel urdu />
        <ActionCard d={d} a={actions[0]} urdu />
        <ActionCard d={d} a={actions[1]} urdu />
      </div>
    </div>
  );
}

// --- Building blocks -------------------------------------------------------

function Parts({ d }: { d: Direction }) {
  const swatches: [string, string][] = [
    ["Brand", d.colors.brand],
    ["Background", d.colors.bg],
    ["Text", d.colors.ink],
    ["Danger only", d.colors.danger],
    ["Learn", d.pillars.learn.fg],
    ["Find help", d.pillars.help.fg],
    ["Report", d.pillars.report.fg],
    ["Supporting", d.pillars.support.fg],
  ];
  return (
    <div className="space-y-5 rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-5">
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Buttons</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <span className={`inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--brand)] px-5 font-semibold text-[var(--brand-ink)] ${press}`}>
            Continue <ChevronRight aria-hidden className="size-5" />
          </span>
          <span className={`inline-flex min-h-12 items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 font-semibold text-[var(--ink)] ${press}`}>
            Back
          </span>
          <span className={`inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--danger)] px-5 font-semibold text-white ${press}`}>
            <Phone aria-hidden className="size-5" /> Call emergency services
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Notice</h3>
        <div className="mt-3 flex gap-3 rounded-[var(--radius)] bg-[var(--brand-soft)] p-4 text-[var(--ink)]">
          <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" />
          <p className="text-[15px] leading-relaxed">
            Hifazat does not send police and cannot guarantee a response. It helps you find information and verified services.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Reading text</h3>
        <p className="mt-2 text-[22px] font-bold leading-tight text-[var(--ink)]">Staying safe online</p>
        <p className="mt-2 text-[16.5px] leading-relaxed text-[var(--ink-soft)]">
          If someone else might check your phone, these steps can help keep your visit private. Use only what feels safe for you.
        </p>
        <p className="mt-2 text-[13px] text-[var(--ink-soft)]">English font: {d.fontName} · Urdu font: Noto Nastaliq Urdu</p>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Colors</h3>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {swatches.map(([label, color]) => (
            <div key={label} className="text-center">
              <span className="block h-12 rounded-xl border border-black/5" style={{ background: color }} />
              <span className="mt-1 block text-[12px] leading-tight text-[var(--ink-soft)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- The page --------------------------------------------------------------

export function DesignOptions() {
  const [chosen, setChosen] = useState<Direction["id"]>("A");
  const d = directions.find((x) => x.id === chosen)!;

  return (
    <div style={vars(d)} className="min-h-dvh bg-[var(--bg)] text-[var(--ink)] transition-colors duration-200">
      <div className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-3">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Hifazat design options</p>
          <div role="tablist" aria-label="Design direction" className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-[var(--bg)] p-1">
            {directions.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={x.id === chosen}
                onClick={() => setChosen(x.id)}
                className={`min-h-11 whitespace-nowrap rounded-full px-2 text-[13.5px] font-semibold transition ${
                  x.id === chosen ? "bg-[var(--brand)] text-[var(--brand-ink)] shadow" : "text-[var(--ink-soft)]"
                }`}
              >
                {x.id} · {x.name.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-md space-y-6 px-4 py-6">
        <section>
          <h1 className="text-[28px] font-bold leading-tight">
            {d.id}. {d.name}
          </h1>
          <p className="mt-2 text-[16px] leading-relaxed text-[var(--ink-soft)]">{d.mood}</p>
        </section>

        <section aria-label="Home screen in English" className="space-y-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Home screen</h2>
          <HomeMock d={d} />
        </section>

        <section aria-label="Home screen in Urdu" className="space-y-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">In Urdu (draft text)</h2>
          <UrduMock d={d} />
        </section>

        <section aria-label="Building blocks" className="space-y-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Building blocks</h2>
          <Parts d={d} />
        </section>

        <p className="pb-8 text-center text-[15px] text-[var(--ink-soft)]">
          Tap A, B or C at the top to compare. Tell Claude which one you prefer, or mix: e.g. &ldquo;B&apos;s colors with C&apos;s grid&rdquo;.
        </p>
      </main>
    </div>
  );
}
