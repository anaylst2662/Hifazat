# Hifazat — Project Plan (plain English)

> **Don't Let Fear Silence You.** Learn. Prevent. Protect. Report. Support.

This document explains how Hifazat is built. The database design is in
[DATABASE.md](DATABASE.md). The founder's setup steps (Vercel, Supabase) are in
[SETUP.md](SETUP.md). The original brief is in
[HIFAZAT_BUILD_PROMPT.md](HIFAZAT_BUILD_PROMPT.md).

> **Change of plan (2026-09-30): web app first.** Installing Flutter on the
> founder's computer was taking too long, and the founder wants to test by
> opening a link, with nothing to install. So we build a **web app** first
> (Next.js), which people can also install on their phone's home screen (PWA).
> The Flutter mobile app is **paused, not deleted**: it lives in `apps/mobile`
> and will reuse the same backend and the same text files later. All features,
> safety rules, principles and phases stay the same.

---

## 1. The big picture

| Part | Who uses it | What it is |
|---|---|---|
| **Hifazat web app** | The public (no account needed) | A fast, mobile-first website, installable on phones (PWA), in English and Urdu |
| **Staff dashboard + admin panel** | Organization staff and Hifazat admins (login) | Pages under `/staff/…` in the same web app, login required, never saved offline (Phase 7) |
| **Backend** | Nobody sees it directly | Supabase: database, logins, file storage, security rules, server functions |
| **Flutter mobile app** *(later)* | The public | Native Android/iOS app using the **same** backend and text files |

```
 ┌───────────────────────┐        ┌────────────────────────────────┐
 │ Web app (Next.js)     │        │ Supabase (shared backend)      │
 │ • hosted on Vercel    │ ─────▶ │ • Database + Row Level Security│
 │ • installable (PWA)   │        │ • Private file storage         │
 │ • works offline for   │        │ • Edge Functions:              │
 │   emergencies         │        │    - submit report             │
 └───────────────────────┘        │    - reference number / status │
 ┌───────────────────────┐        │    - AI assistant ──▶ Claude   │
 │ Flutter app (later)   │ ─────▶ │                                │
 └───────────────────────┘        └────────────────────────────────┘
```

**Key idea:** all important logic lives in Supabase (security rules, database
functions, Edge Functions), not in the web app. The web app only shows things
and calls Supabase. So the Flutter app can reuse everything later without
rewriting it. The web app never holds secret keys and never talks to Claude
directly.

---

## 2. Technology

| Choice | Why |
|---|---|
| **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** | Very widely used; pages are pre-built as static files, so they load fast on cheap phones |
| **Vercel** hosting, connected to GitHub | Every push gives a new link to test; nothing to install locally |
| **Supabase** (unchanged) | Database, login, storage, security rules, server functions |
| **PWA** with a hand-written offline helper (`apps/web/public/sw.js`) | About 150 lines we fully understand; explicitly never saves staff pages |
| **Shared translations** in `shared/i18n/*.json` | One file per language, flat keys, readable by both the web app and Flutter |
| Icons: `lucide-react` | Only the icons we use are sent to the phone |
| Tests: **Playwright** browser tests + **axe** accessibility scan | Automatically checks Quick Exit, Back, Urdu right-to-left layout, offline mode, contrast, tap sizes |

### Earlier decisions: still approved, adapted to the web

1. **Staff pages are separated.** They live under `/staff/…` with their own
   layout, require login, are never saved by the offline helper, and are hidden
   from search engines (already set up in `next.config.ts` and `sw.js`).
2. **Reports go through a Supabase Edge Function**, never direct table writes.
3. **Maps:** the web equivalent of `flutter_map` is **Leaflet** with
   OpenStreetMap. It loads only when the user opens the map; the directory also
   works as a plain list. Before launch we switch to a tile provider that
   allows app use.
4. **Supabase region: Singapore.**
5. **Encrypted storage on the device:** the safety plan is stored only in this
   browser, encrypted with the browser's built-in encryption (Web Crypto,
   AES-GCM), with a clear warning about shared devices (Phase 2).
6. **No push notifications, analytics or crash-reporting services** in the MVP.

---

## 2b. Design system (direction C, "Modern Trust")

| Part | Where | Rule |
|---|---|---|
| Colors | `apps/web/src/app/globals.css` (`--color-*` tokens) | Navy brand, light grey page, white cards; softened pillar colors (Learn green, Find Help blue, Report amber, Supporting violet); **red only for danger/emergency** |
| Fonts | `[lang]/layout.tsx` | Plus Jakarta Sans for English; Noto Nastaliq Urdu (extra line height) only on Urdu pages |
| Parts | `apps/web/src/components/` and `components/ui/` | Pages are built only from these: header, footer, page layout, buttons, cards, icon badges, notices, Quick Exit, language switcher |
| Icons | Lucide only | No emojis in the interface |
| Accessibility | `e2e/design.spec.ts` | WCAG AA contrast, 48px tap targets, focus outlines, screen-reader labels; checked automatically |
| Motion | `ui/styles.ts` (`pressable`) | Subtle 150 ms press feedback; off when the phone asks for reduced motion |

## 3. How the code is organized

```
Hifazat/
├── PROGRESS.md              ← status, next steps, decisions (read first!)
├── docs/                    ← plain-English documents
├── shared/i18n/             ← en.json, ur.json: ALL words shown to users
├── ai/system_prompt.md      ← AI assistant instructions (Phase 6)
├── supabase/                ← database (migrations), security rules, Edge Functions
├── apps/
│   ├── web/                 ← the Next.js web app (active)
│   │   ├── src/app/[lang]/      public pages, e.g. /en/now, /ur/tips
│   │   ├── src/app/(entry)/     the start address "/" (picks the language)
│   │   ├── src/app/staff/       staff dashboard + admin (Phase 7)
│   │   ├── src/components/      Quick Exit, Back, language switch, …
│   │   ├── src/i18n/            loads the shared translation files
│   │   ├── public/sw.js         offline helper
│   │   └── e2e/                 automated browser tests
│   └── mobile/              ← Flutter app (paused)
└── .env.example             ← where each setting/secret belongs
```

### Web addresses (kept neutral on purpose)

| Section | Address | Phase |
|---|---|---|
| Home | `/en`, `/ur` | 1 ✅ |
| I'm in Danger | `/en/now` | 2 ✅ |
| My Safety Plan | `/en/plan` | 2 ✅ |
| Learn & Stay Safe | `/en/learn` | 3 |
| I Need Help | `/en/services` | 4 |
| I Want to Report | `/en/form` | 5 |
| I'm Supporting Someone | `/en/guide` | 6 |
| Staying safe online | `/en/tips` | 1 ✅ |
| Staff / admin | `/staff/…` | 7 |

Choices made inside a page (like a report type) are never put in the address.
Every public page shows only "Hifazat" in the browser tab.

**Language:** English is the default for every new visitor. Urdu is used only
when the visitor picks it with the header switch; the choice is remembered in
that browser. The phone's language is not used.

---

## 4. Safety rules built into the design

Checked at the end of every phase:

- **Quick Exit** on every page: a clearly visible button, plus pressing **Esc
  three times**. It uses `location.replace()` to go to a neutral page (a weather
  search), so Back does not return to that Hifazat page. The site also tells the
  destination nothing about where the visitor came from (`Referrer-Policy:
  no-referrer`). We say honestly that the browser's history list can still show
  Hifazat, and explain private mode on the "Staying safe online" page.
- **Normal Back navigation** still works (the founder's choice), plus a large
  on-screen **Back** button on every inner page.
- **Emergency first.** "I'm in Danger" never asks for login or a form.
- **Offline.** Emergency numbers, the safety plan and core safety guides are
  saved on the device (Phase 2 onwards; the home and tips pages already are).
- **No phone numbers in the code.** All numbers come from the database with
  `verified_by` / `verified_at`; development data is marked **PLACEHOLDER**.
- **No account needed** for Learn, Danger, Find Help and Anonymous Report.
- **Non-blaming language** everywhere.
- **Calm, mobile-first UI:** large buttons, an icon with every label, strong
  contrast, text that grows with the phone's text size, screen-reader labels,
  system fonts (nothing to download for English).
- **Test versions** show a yellow "Test version" banner and ask search engines
  not to list them.

---

## 5. Build phases

| Phase | What we build | How you'll test it |
|---|---|---|
| **0** Setup & plan | Project, Git, docs, database design | ✅ Done |
| **0b** Web-first setup | Folders reorganized, Next.js app, Vercel | Open the Vercel link |
| **1** App shell | Home, navigation, Quick Exit, English/Urdu + RTL, design | Open the link on your phone |
| **2** Protect & Safety Plan | "I'm in Danger", trusted contacts, offline numbers, safety plan in the browser | Airplane-mode test on your phone |
| **3** Awareness Hub | Articles, scenario cards, quizzes, campaigns, offline | Browse SAMPLE content |
| **4** Directory & Map | Verified organizations, Find Help flow, map | Search and filter orgs |
| **5** Reporting | Three report modes, reference number, attachments, status check | Submit a test report |
| **6** Supporter guide + AI | "I'm Supporting Someone", AI assistant | Chat with the assistant |
| **7** Dashboard & Admin | `/staff`: login, roles, cases, content, verification, statistics | Log in as test staff |
| **8** Security review | Test every security rule; written risk report | Read the report |
| **9** Release prep | Production web deploy + PWA; pre-launch checklist | Install from the browser |
| **Later** Flutter app | Android/iOS app on the same backend | Install the test APK |

---

## 6. Where secrets go

| Secret / setting | Where it lives | Never |
|---|---|---|
| Supabase **URL** + **anon (public) key** | Vercel → Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) | Designed to be public; the database rules protect data |
| Supabase **service_role / secret key** | Only inside the Supabase dashboard | ❌ Never in the web app, Vercel, Git, or chat |
| **Anthropic (Claude) API key** | Supabase → Edge Functions → Secrets | ❌ Never in the web app, Vercel, or Git |
| Database password | Your password manager | ❌ Never in Git or chat |

`.gitignore` blocks `.env` files, and `apps/web/.env.example` shows exactly which
two public values the web app may have.
