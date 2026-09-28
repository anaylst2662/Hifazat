# Hifazat — Project Plan (plain English)

> **Don't Let Fear Silence You.** Learn. Prevent. Protect. Report. Support.

This document explains how Hifazat is built, in plain language. The database
design is in [DATABASE.md](DATABASE.md). How to set up your computer is in
[SETUP.md](SETUP.md).

---

## 1. The big picture

Hifazat has three parts that all live in this one project folder:

| Part | Who uses it | What it is |
|---|---|---|
| **The Hifazat app** | The public (anyone, no account needed) | A Flutter app for Android (first), iPhone, and the web |
| **The staff dashboard** | Organization staff and Hifazat admins (login required) | A Flutter **website** built from the same code |
| **The backend** | Nobody sees it directly | Supabase: the database, logins, file storage, and small server programs ("Edge Functions") |

```
 ┌─────────────────────┐        ┌───────────────────────────────┐
 │  Hifazat app        │        │  Supabase (the backend)       │
 │  (Android/iOS/web)  │ ─────▶ │  • Database (with security    │
 │  works offline for  │        │    rules on every table)      │
 │  emergencies        │        │  • Private file storage       │
 └─────────────────────┘        │  • Edge Functions:            │
 ┌─────────────────────┐        │     - submit a report         │
 │  Staff dashboard    │ ─────▶ │     - check report status     │
 │  (website, login)   │        │     - AI assistant ──▶ Claude │
 └─────────────────────┘        └───────────────────────────────┘
```

**Key idea:** The app never talks to Claude (the AI) directly, and never holds
secret keys. Anything secret or sensitive happens inside Supabase.

---

## 2. Technology choices, and my review of them

You asked me to say if any choice is wrong for a beginner. I reviewed each one
and **I agree with all of them**. I have added a few small adjustments,
explained below.

| Choice | Verdict | Notes |
|---|---|---|
| Flutter (one codebase) | ✅ Good | Very well supported. Fast on low-end Android. |
| Supabase | ✅ Good | No server to run. Has security rules (RLS), storage, and functions built in. |
| Row Level Security on every table | ✅ Essential | We will write a test for every rule in Phase 8. |
| Claude via Edge Function only | ✅ Correct | The API key stays on the server. |
| OpenStreetMap via `flutter_map` | ✅ Good, **one caution** | See "Maps" below. |
| Riverpod for state | ✅ Good | It is the most common modern choice. We will use it everywhere, one way. |
| English + Urdu (RTL) | ✅ Good | We use Flutter's built-in translation system (one file per language). Adding Shina or Burushaski later = add one file. |

### My adjustments (please approve)

1. **The staff dashboard is NOT inside the Android app.**
   It stays in the same project, but it gets its own entry point, so it is only
   built into the **website**. Reasons:
   - The public app stays small and fast on low-end phones.
   - If someone looks at a user's phone, there is no sign of staff features.
   - There is less code in the app that could be attacked.

2. **Reports are submitted through a server function, not written directly
   to the database.** Anonymous people cannot touch the reports table at all.
   A small Edge Function receives the report, checks it, saves it, and
   returns the reference number and private code. This is much safer.

3. **Maps caution.** When the map is shown, the phone downloads map pictures
   ("tiles") from a tile server. That server can see which area is being
   viewed (not the user's GPS, just the map area). So:
   - The map loads **only when the user opens it**. The directory also works
     as a plain list with no map.
   - The user's own GPS location is **never** sent anywhere unless they
     choose to share it.
   - The public OpenStreetMap tile server is fine for development, but its
     rules do not allow heavy app use. **Before launch** we switch to a tile
     provider that allows it (or host our own). I'll remind you in Phase 9.

4. **Server location.** When you create the Supabase project, choose the
   region closest to Pakistan (**Mumbai / South Asia** if offered, otherwise
   Singapore). Whether data may be stored outside Pakistan is a legal
   question — it's on the pre-launch legal checklist.

5. **Encrypted storage on the phone.** The safety plan will be saved in an
   encrypted local database. The encryption key is kept in the phone's secure
   key store (Android Keystore / iOS Keychain). Exact package chosen in
   Phase 2.

6. **No push notifications, analytics, or crash-reporting services in the
   MVP.** They send data to third parties. We can add privacy-respecting ones
   later, only if needed.

---

## 3. How the code is organized

```
Hifazat/
├── PROGRESS.md            ← what's done, what's next, decisions (read this first!)
├── docs/                  ← plain-English documents (this file, database, setup)
├── ai/system_prompt.md    ← the AI assistant's instructions (Phase 6), reviewable
├── lib/                   ← the Flutter app code
│   ├── main.dart              public app entry point
│   ├── main_dashboard.dart    staff website entry point (Phase 7)
│   ├── core/                  shared: theme, colors, translations, Quick Exit, offline cache
│   └── features/              one folder per feature:
│       ├── home/  protect/  safety_plan/  awareness/  directory/
│       ├── report/  supporter/  assistant/  settings/
│       └── dashboard/ admin/  (website only)
├── supabase/
│   ├── config.toml         Supabase project settings
│   ├── migrations/         the database design, as SQL files (numbered, in order)
│   ├── seed.sql            PLACEHOLDER numbers + SAMPLE content (never real)
│   └── functions/          server programs: submit-report, report-status, assistant
├── android/ ios/ web/      platform files (created by Flutter; rarely edited)
└── test/                   automated tests
```

---

## 4. Safety rules built into the design

These apply everywhere and I'll check them at the end of every phase:

- **Quick Exit** on every sensitive screen. One tap goes to a neutral
  "Notes" screen and clears the back history.
- **Emergency first.** "I'm in Danger" never asks for login or a form first.
- **Offline.** Emergency numbers, the safety plan and core safety guides are
  saved on the phone and work with no internet.
- **No phone numbers in the code.** All numbers come from the database with
  `verified_by` / `verified_at`. Development data is marked **PLACEHOLDER**,
  and the app shows a clear warning banner whenever a number is not verified.
- **No account needed** for Learn, Danger, Find Help and Anonymous Report.
- **Non-blaming language** in every piece of text.
- **Calm UI:** large buttons, icons with every label, good contrast, text that
  scales, and screen-reader labels.

---

## 5. Build phases

We stop after each phase so you can test and approve.

| Phase | What we build | How you'll test it |
|---|---|---|
| **0** Setup & plan | Project skeleton, Git, docs, database design | Read the docs; run the placeholder app |
| **1** App shell | Home screen, navigation, Quick Exit, English/Urdu + RTL, design system | Run the app on your phone |
| **2** Protect & Safety Plan | "I'm in Danger", trusted contacts, offline numbers, safety plan | Airplane-mode test on your phone |
| **3** Awareness Hub | Articles, scenario cards, quizzes, campaigns, offline cache | Browse SAMPLE content |
| **4** Directory & Map | Verified organizations, Find Help flow, map | Search and filter orgs |
| **5** Reporting | Three report modes, reference number, attachments, status check | Submit a test report, check status |
| **6** Supporter guide + AI | "I'm Supporting Someone", AI assistant | Chat with the assistant |
| **7** Dashboard & Admin | Staff login, roles, case views, content, verification, stats | Log in as test staff |
| **8** Security review | Test every security rule; written risk report | Read the report |
| **9** Release prep | Android test APK, website deployed, pre-launch checklist | Install the APK |

---

## 6. Where secrets go

| Secret | Where it lives | Never |
|---|---|---|
| Supabase **URL** and **anon (public) key** | In a local `.env` file on your computer, passed to the app when building | Not secret by itself — security comes from the database rules |
| Supabase **service_role key** | Only in the Supabase dashboard | ❌ Never in the app, never in Git, never shared in chat |
| **Anthropic (Claude) API key** | Supabase → Edge Functions → Secrets | ❌ Never in the app, never in Git |
| Database password | Your password manager | ❌ Never in Git |
| Android signing key (Phase 9) | Your computer + a backup in your password manager | ❌ Never in Git |

`.gitignore` already blocks `.env` files and signing keys from being saved to Git.
