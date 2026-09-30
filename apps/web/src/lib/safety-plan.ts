"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { deleteAllPrivateData, loadEncrypted, saveEncrypted, secureStoreSupported } from "./secure-store";

// The safety plan: saved encrypted, only in this browser (see secure-store.ts).

export type PlanPerson = { id: string; name: string; phone: string };
export type PlanNote = { id: string; text: string };
export type PlanCheck = { id: string; label: string; done: boolean; custom?: boolean };

export type SafetyPlan = {
  version: 1;
  trustedContacts: PlanPerson[]; // people to message in an emergency
  peopleToCall: PlanPerson[]; // other people I can call
  safePlaces: PlanNote[];
  transport: PlanNote[];
  documents: PlanCheck[]; // "label" is a translation key for built-in items
  emergencyItems: PlanCheck[];
};

export const PLAN_STORAGE_NAME = "safety-plan";

export const DEFAULT_DOCUMENTS = [
  "planDocCnic",
  "planDocChildren",
  "planDocNikah",
  "planDocBank",
  "planDocMedical",
  "planDocProperty",
];
export const DEFAULT_ITEMS = [
  "planItemPhone",
  "planItemMoney",
  "planItemKeys",
  "planItemMedicine",
  "planItemClothes",
  "planItemNumbers",
];

export function emptyPlan(): SafetyPlan {
  return {
    version: 1,
    trustedContacts: [],
    peopleToCall: [],
    safePlaces: [],
    transport: [],
    documents: DEFAULT_DOCUMENTS.map((label) => ({ id: label, label, done: false })),
    emergencyItems: DEFAULT_ITEMS.map((label) => ({ id: label, label, done: false })),
  };
}

export function newId(): string {
  return crypto.randomUUID();
}

export type PlanStatus = "loading" | "ready" | "unavailable";

/** Loads the plan, and saves every change automatically (encrypted). */
export function useSafetyPlan() {
  const [status, setStatus] = useState<PlanStatus>("loading");
  const [plan, setPlan] = useState<SafetyPlan>(emptyPlan);
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!secureStoreSupported()) throw new Error("unsupported");
      const saved = await loadEncrypted<SafetyPlan>(PLAN_STORAGE_NAME);
      if (cancelled) return;
      if (saved) setPlan({ ...emptyPlan(), ...saved });
      loaded.current = true;
      setStatus("ready");
    })().catch(() => {
      if (!cancelled) setStatus("unavailable");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((change: (plan: SafetyPlan) => SafetyPlan) => {
    setPlan((current) => {
      const next = change(current);
      if (loaded.current) saveEncrypted(PLAN_STORAGE_NAME, next).catch(() => setStatus("unavailable"));
      return next;
    });
  }, []);

  const deleteEverything = useCallback(async () => {
    await deleteAllPrivateData();
    setPlan(emptyPlan());
  }, []);

  return { status, plan, update, deleteEverything };
}
