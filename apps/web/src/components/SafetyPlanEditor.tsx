"use client";

import { useId, useState } from "react";
import {
  Bus,
  CheckSquare,
  FileText,
  Home,
  LockKeyhole,
  Phone,
  Plus,
  Trash2,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  newId,
  useSafetyPlan,
  type PlanCheck,
  type PlanNote,
  type PlanPerson,
  type SafetyPlan,
} from "@/lib/safety-plan";
import { telLink } from "@/lib/messaging";
import { format } from "@/i18n/format";
import type { SAFETY_PLAN_TEXT } from "./text-keys";
import { Card } from "./ui/Card";
import { Notice } from "./ui/Notice";
import { buttonClass, inputClass, sectionTitleClass } from "./ui/styles";


type Text = Record<(typeof SAFETY_PLAN_TEXT)[number], string>;
type PeopleKey = "trustedContacts" | "peopleToCall";
type NotesKey = "safePlaces" | "transport";
type ChecksKey = "documents" | "emergencyItems";

const iconButton =
  "inline-flex size-12 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-danger-soft hover:text-danger";

function SectionHeader({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint: string }) {
  return (
    <div>
      <h2 className={`flex items-center gap-2 ${sectionTitleClass}`}>
        <Icon aria-hidden="true" className="size-5 text-brand" />
        {title}
      </h2>
      <p className="mt-1 text-[0.9375rem] text-ink-soft">{hint}</p>
    </div>
  );
}

function PeopleSection(props: {
  icon: LucideIcon;
  title: string;
  hint: string;
  people: PlanPerson[];
  text: Text;
  testId: string;
  onAdd: (p: PlanPerson) => void;
  onRemove: (id: string) => void;
}) {
  const { text } = props;
  const nameId = useId();
  const phoneId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <Card className="space-y-4" data-testid={props.testId}>
      <SectionHeader icon={props.icon} title={props.title} hint={props.hint} />
      {props.people.length === 0 ? (
        <p className="text-ink-soft">{text.planEmpty}</p>
      ) : (
        <ul className="divide-y divide-line">
          {props.people.map((p) => (
            <li key={p.id} className="flex items-center gap-2 py-2">
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">{p.name}</span>
                <span dir="ltr" className="block text-sm text-ink-soft tabular-nums">
                  {p.phone}
                </span>
              </span>
              <a
                href={telLink(p.phone)}
                aria-label={format(text.callAria, { name: p.name, phone: p.phone })}
                className="inline-flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand"
              >
                <Phone aria-hidden="true" className="size-5" />
              </a>
              <button
                type="button"
                onClick={() => props.onRemove(p.id)}
                aria-label={format(text.planRemove, { name: p.name })}
                className={iconButton}
              >
                <Trash2 aria-hidden="true" className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !phone.trim()) return;
          props.onAdd({ id: newId(), name: name.trim(), phone: phone.trim() });
          setName("");
          setPhone("");
        }}
      >
        <div>
          <label htmlFor={nameId} className="mb-1.5 block text-[0.9375rem] font-medium">
            {text.planName}
          </label>
          <input
            id={nameId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label htmlFor={phoneId} className="mb-1.5 block text-[0.9375rem] font-medium">
            {text.planPhone}
          </label>
          <input
            id={phoneId}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="off"
            required
          />
        </div>
        <button type="submit" className={buttonClass("primary")}>
          <Plus aria-hidden="true" className="size-5" />
          {text.planAdd}
        </button>
      </form>
    </Card>
  );
}

function NotesSection(props: {
  icon: LucideIcon;
  title: string;
  hint: string;
  notes: PlanNote[];
  text: Text;
  onAdd: (n: PlanNote) => void;
  onRemove: (id: string) => void;
}) {
  const { text } = props;
  const inputId = useId();
  const [value, setValue] = useState("");
  return (
    <Card className="space-y-4">
      <SectionHeader icon={props.icon} title={props.title} hint={props.hint} />
      {props.notes.length === 0 ? (
        <p className="text-ink-soft">{text.planEmpty}</p>
      ) : (
        <ul className="divide-y divide-line">
          {props.notes.map((n) => (
            <li key={n.id} className="flex items-center gap-2 py-2">
              <span className="min-w-0 flex-1 text-ink">{n.text}</span>
              <button
                type="button"
                onClick={() => props.onRemove(n.id)}
                aria-label={format(text.planRemove, { name: n.text })}
                className={iconButton}
              >
                <Trash2 aria-hidden="true" className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          props.onAdd({ id: newId(), text: value.trim() });
          setValue("");
        }}
      >
        <div className="flex-1">
          <label htmlFor={inputId} className="mb-1.5 block text-[0.9375rem] font-medium">
            {text.planAddYourOwn}
          </label>
          <input
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputClass}
            autoComplete="off"
          />
        </div>
        <button type="submit" className={buttonClass("primary")} aria-label={`${text.planAdd}: ${props.title}`}>
          <Plus aria-hidden="true" className="size-5" />
          <span className="max-sm:sr-only">{text.planAdd}</span>
        </button>
      </form>
    </Card>
  );
}

function ChecklistSection(props: {
  icon: LucideIcon;
  title: string;
  hint: string;
  items: PlanCheck[];
  text: Text;
  onToggle: (id: string) => void;
  onAdd: (c: PlanCheck) => void;
  onRemove: (id: string) => void;
}) {
  const { text } = props;
  const inputId = useId();
  const [value, setValue] = useState("");
  const labelOf = (item: PlanCheck) =>
    item.custom ? item.label : ((text as Record<string, string>)[item.label] ?? item.label);
  return (
    <Card className="space-y-4">
      <SectionHeader icon={props.icon} title={props.title} hint={props.hint} />
      <ul className="space-y-1">
        {props.items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <label className="flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-xl px-2 hover:bg-bg">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => props.onToggle(item.id)}
                className="size-5 shrink-0 accent-[var(--color-brand)]"
              />
              <span className={item.done ? "text-ink-soft line-through" : "text-ink"}>{labelOf(item)}</span>
            </label>
            {item.custom && (
              <button
                type="button"
                onClick={() => props.onRemove(item.id)}
                aria-label={format(text.planRemove, { name: item.label })}
                className={iconButton}
              >
                <Trash2 aria-hidden="true" className="size-5" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          props.onAdd({ id: newId(), label: value.trim(), done: false, custom: true });
          setValue("");
        }}
      >
        <div className="flex-1">
          <label htmlFor={inputId} className="mb-1.5 block text-[0.9375rem] font-medium">
            {text.planAddYourOwn}
          </label>
          <input
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputClass}
            autoComplete="off"
          />
        </div>
        <button type="submit" className={buttonClass("primary")} aria-label={`${text.planAdd}: ${props.title}`}>
          <Plus aria-hidden="true" className="size-5" />
          <span className="max-sm:sr-only">{text.planAdd}</span>
        </button>
      </form>
    </Card>
  );
}

/** The whole safety plan. Saved encrypted, only in this browser. */
export function SafetyPlanEditor({ text }: { text: Text }) {
  const { status, plan, update, deleteEverything } = useSafetyPlan();
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const addTo = <K extends PeopleKey | NotesKey | ChecksKey>(key: K, item: SafetyPlan[K][number]) => {
    setDeleted(false);
    update((p) => ({ ...p, [key]: [...p[key], item] }));
  };
  const removeFrom = (key: PeopleKey | NotesKey | ChecksKey, id: string) =>
    update((p) => ({ ...p, [key]: (p[key] as { id: string }[]).filter((x) => x.id !== id) }));
  const toggle = (key: ChecksKey, id: string) =>
    update((p) => ({ ...p, [key]: p[key].map((c) => (c.id === id ? { ...c, done: !c.done } : c)) }));

  return (
    <>
      <Notice icon={LockKeyhole} title={text.planPrivacyTitle}>
        {text.planPrivacyBody}
      </Notice>

      {status === "loading" && <p className="px-1 text-ink-soft">{text.planLoading}</p>}
      {status === "unavailable" && <Notice tone="danger">{text.planUnavailable}</Notice>}

      {status === "ready" && (
        <>
          {deleted && <Notice>{text.planDeleted}</Notice>}
          <PeopleSection
            icon={Users}
            title={text.planTrustedTitle}
            hint={text.planTrustedHint}
            testId="plan-trusted"
            people={plan.trustedContacts}
            text={text}
            onAdd={(p) => addTo("trustedContacts", p)}
            onRemove={(id) => removeFrom("trustedContacts", id)}
          />
          <PeopleSection
            icon={UserRound}
            title={text.planPeopleTitle}
            hint={text.planPeopleHint}
            testId="plan-people"
            people={plan.peopleToCall}
            text={text}
            onAdd={(p) => addTo("peopleToCall", p)}
            onRemove={(id) => removeFrom("peopleToCall", id)}
          />
          <NotesSection
            icon={Home}
            title={text.planSafePlacesTitle}
            hint={text.planSafePlacesHint}
            notes={plan.safePlaces}
            text={text}
            onAdd={(n) => addTo("safePlaces", n)}
            onRemove={(id) => removeFrom("safePlaces", id)}
          />
          <NotesSection
            icon={Bus}
            title={text.planTransportTitle}
            hint={text.planTransportHint}
            notes={plan.transport}
            text={text}
            onAdd={(n) => addTo("transport", n)}
            onRemove={(id) => removeFrom("transport", id)}
          />
          <ChecklistSection
            icon={FileText}
            title={text.planDocumentsTitle}
            hint={text.planDocumentsHint}
            items={plan.documents}
            text={text}
            onToggle={(id) => toggle("documents", id)}
            onAdd={(c) => addTo("documents", c)}
            onRemove={(id) => removeFrom("documents", id)}
          />
          <ChecklistSection
            icon={CheckSquare}
            title={text.planItemsTitle}
            hint={text.planItemsHint}
            items={plan.emergencyItems}
            text={text}
            onToggle={(id) => toggle("emergencyItems", id)}
            onAdd={(c) => addTo("emergencyItems", c)}
            onRemove={(id) => removeFrom("emergencyItems", id)}
          />

          <p className="px-1 text-sm text-ink-soft">{text.planSavedNote}</p>

          <Card className="space-y-3">
            <h2 className={`flex items-center gap-2 ${sectionTitleClass}`}>
              <Trash2 aria-hidden="true" className="size-5 text-danger" />
              {text.planDeleteTitle}
            </h2>
            <p className="text-ink-soft">{text.planDeleteBody}</p>
            {confirming ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={buttonClass("danger")}
                  data-testid="plan-delete-confirm"
                  onClick={async () => {
                    await deleteEverything();
                    setConfirming(false);
                    setDeleted(true);
                  }}
                >
                  {text.planDeleteConfirm}
                </button>
                <button type="button" className={buttonClass("secondary")} onClick={() => setConfirming(false)}>
                  {text.planDeleteCancel}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={buttonClass("secondary")}
                onClick={() => setConfirming(true)}
                data-testid="plan-delete"
              >
                {text.planDeleteTitle}
              </button>
            )}
          </Card>
        </>
      )}
    </>
  );
}
