# Hifazat — Progress Log

> Read this first when starting a new session. It records what is done, what
> is next, and every decision we made. The original brief is in
> `docs/HIFAZAT_BUILD_PROMPT.md`.

**Current phase:** Phase 2 (Protect & Safety Plan) ✅ built, **waiting for founder testing and approval**
**Working branch:** `claude/blissful-shannon-aep047`
**Active app:** `apps/web` (Next.js). `apps/mobile` (Flutter) is paused.

---

## Change of plan — 2026-09-30: web app first

- **What:** build the web app (Next.js + TypeScript + Tailwind, hosted on
  Vercel, installable as a PWA) first. Flutter is paused and moved to
  `apps/mobile`, not deleted.
- **Why:** installing Flutter on the founder's computer was taking too long;
  the founder wants to test by opening a link, with nothing to install.
- **What stays the same:** all features, safety rules, principles, phases,
  the six approved adjustments, Supabase (Singapore), the database design,
  admins seeing statistics only, and the placeholder retention periods.
- **Safe snapshot:** commit `459550f` ("Phase 0: project setup, plan and
  database design") is the last Flutter-only state. (A Git tag could not be
  pushed from the cloud workspace, which may only push to the working branch.)

---

## Done

### Phase 0 — Setup & plan (2026-09-28)
- Flutter project (now in `apps/mobile`), Supabase folder, secret protection,
  docs (`PLAN.md`, `DATABASE.md`, `SETUP.md`), this file.

### Phase 0b — Web-first setup (2026-09-30)
- Flutter moved to `apps/mobile` (still analyzes and tests clean).
- Original brief saved as `docs/HIFAZAT_BUILD_PROMPT.md`.
- Next.js 16 app created in `apps/web`.
- Shared translations in `shared/i18n/en.json` + `ur.json` (flat keys, `{placeholder}` style, Flutter-compatible).
- `docs/PLAN.md` and `docs/SETUP.md` rewritten for the web (Vercel steps included).

### Phase 1 — App shell (web) (2026-09-30)
- Home screen "What do you need right now?" with the 5 colored actions (icon + label + hint).
- Placeholder pages for each section, with neutral addresses: `/now`, `/learn`, `/services`, `/form`, `/guide`.
- Quick Exit button on every page + Esc ×3 shortcut → `location.replace()` to a weather search.
- On-screen Back button on inner pages; the browser's normal Back button also works.
- English / Urdu, right-to-left for Urdu, Noto Nastaliq Urdu font (self-hosted, Urdu pages only).
- "Staying safe online" page (`/tips`): Quick Exit, history, private mode, shared devices, home-screen icon.
- Design system: color tokens in `apps/web/src/app/globals.css`, large buttons, focus outlines, scalable text.
- PWA: install manifests (EN/UR), icons, offline helper `public/sw.js` (saves core public pages; never `/staff`, `/api`, `/auth`).
- Privacy/security headers: `Referrer-Policy: no-referrer`, nosniff, no framing; staff routes `no-store` + `noindex`.
- Test version banner + search engines told not to list the site (both switch off with `NEXT_PUBLIC_SHOW_PREVIEW_BANNER=false`).
- Checks: `npm run check:i18n`, `npm run lint`, `npm run typecheck`, 14 Playwright browser tests (all passing).

### Phase 1b — Professional redesign + language changes (2026-09-30)
- Founder compared 3 directions on a temporary `/design` page and chose **C. Modern Trust** (page since removed).
- Design system in `apps/web/src/app/globals.css` (color tokens, radius, shadows) and `apps/web/src/components/ui/`
  (`styles.ts` button/tone classes, `Card`, `IconBadge`, `Notice`); shared parts `AppHeader`, `AppFooter`,
  `PageLayout`, `QuickExitButton`, `LanguageSwitcher`, `BackButton`, `DangerCard`, `ActionTile`, `ComingSoon`.
- Look: navy header band, white cards with thin borders, soft pillar tints, red only for "I'm in Danger".
  Font: Plus Jakarta Sans (self-hosted); Noto Nastaliq Urdu attached only to Urdu pages.
- Home: navy title band, large red danger card, 2×2 grid of tiles (icon, title, one line).
- Language: English is always the default; the phone's language is no longer used; Urdu is chosen with the
  header switch and remembered in the browser. `ur.json` carries `"@@status": "DRAFT…"`; the checker prints a
  reminder; the Urdu test banner says the translation is a draft.
- App icon and theme color changed to navy; offline cache version bumped to v2.
- New automated checks (`e2e/design.spec.ts`): WCAG AA contrast for every token pair, axe accessibility scan on
  7 pages (EN + UR), all tap targets ≥ 48px, red used only for the danger card, English pages never load the Urdu font.
  26 browser tests passing.

### Phase 2 — Protect & Safety Plan (2026-09-30)
- **Database** (`supabase/migrations/20260930120000_protect_contact_numbers.sql`):
  `districts` (10 Gilgit-Baltistan districts, Urdu names DRAFT) and `contact_numbers`
  (`verified_by`, `verified_at`, `is_placeholder`, `is_published`), Row Level Security:
  the public can only read published rows; no one can write from the apps. A real number
  cannot exist without verification; changing a number unpublishes it until re-verified.
  Function `get_emergency_contacts()` is what web (and later Flutter) call.
- **Seed** (`supabase/seed.sql`): 8 PLACEHOLDER numbers, all fake `000-000-…` so testers
  can't reach real services by accident.
- **Database tests** (`supabase/tests/`, run with `run-local.sh` on local PostgreSQL): 6 checks, all passing.
- **"I'm in Danger"** (`/now`): emergency call buttons first (red, tap-to-call), TEST NUMBER
  badges + warning, honest "does not send police" text, "Message someone you trust"
  (SMS/WhatsApp opened with a ready message; person checks and sends it themselves; location
  only if ticked, via the phone's permission prompt, as an OpenStreetMap link), 4 calm
  non-blaming steps, helplines, district picker (choice remembered on the device), link to plan.
  Numbers are fetched on the server and the page is refreshed hourly, so visitors' phones
  never contact Supabase for it and it is saved for offline use.
- **My Safety Plan** (`/plan`): trusted contacts, people I can call, safe places, transport,
  documents checklist, emergency bag checklist (custom items allowed), delete everything
  (with confirmation). Stored AES-GCM encrypted in IndexedDB with a non-extractable
  browser key; never sent anywhere; shared-device warning shown.
- Offline: `/now` and `/plan` added to core pages (offline helper v3).
- Home screen: link to My Safety Plan.
- Tests: 40 browser tests (with a stand-in Supabase built from the real schema), incl.
  encryption check, offline check, WhatsApp number format, location opt-in, axe on new pages.

## Next

1. **Founder:** follow `docs/SETUP.md` **Part C** (paste migration + seed into Supabase SQL
   Editor, check Vercel settings, redeploy). Then test on phone.
2. **Founder:** approve Phase 2.
3. **Phase 3 — Awareness Hub:** content tables (topics, audiences, content items with
   translations, reviewed_by, status), SAMPLE — DO NOT PUBLISH content, scenario cards,
   quizzes, campaigns with shareable images, offline caching of core guides.

## Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-09-28 | Supabase + Claude via Edge Function; RLS on every table | Brief; reviewed as appropriate |
| 2026-09-28 | Staff dashboard kept separate from the public app | Smaller, safer public app *(approved)* |
| 2026-09-28 | Reports submitted only via an Edge Function | No direct anonymous DB writes *(approved)* |
| 2026-09-28 | Map loads only when opened; launch-approved tile provider before release | Privacy; OSM tile policy *(approved)* |
| 2026-09-28 | Admins see statistics, not report contents | Least privilege *(approved)* |
| 2026-09-28 | No push notifications / analytics / crash reporting in MVP | Data minimization *(approved)* |
| 2026-09-28 | Retention periods in DATABASE.md §5 are placeholders | Final values need legal advice *(approved as placeholders)* |
| 2026-09-30 | Supabase region: Singapore | Founder's choice |
| 2026-09-30 | **Web first** (Next.js App Router, TypeScript, Tailwind, Vercel, PWA); Flutter paused in `apps/mobile` | Founder can test via a link with no installs |
| 2026-09-30 | All important logic in Supabase (RLS, DB functions, Edge Functions) | Flutter can reuse it later unchanged |
| 2026-09-30 | Translations: `shared/i18n/*.json`, flat camelCase keys, `{name}` placeholders; Next.js's own i18n pattern, no extra library | Reusable by Flutter; simple |
| 2026-09-30 | Language in the address (`/en`, `/ur`); `/` opens the saved choice, otherwise English | Lets both languages be pre-built and saved offline |
| 2026-09-30 | Back button: **normal browser Back works**, plus on-screen Back button (founder's choice) | Familiar navigation. Quick Exit still replaces the current page, but earlier Hifazat pages can remain in the tab's history; explained on `/tips` |
| 2026-09-30 | Quick Exit destination: `https://www.google.com/search?q=weather` (set in `apps/web/src/lib/config.ts`) | Neutral, familiar; easy to change |
| 2026-09-30 | Hand-written service worker instead of a PWA plugin | Small, transparent, explicit "never cache staff" rule |
| 2026-09-30 | Design direction **C. Modern Trust** (navy #14325a, Plus Jakarta Sans, grid home) | Founder's choice from 3 options |
| 2026-09-30 | **English is the default**; the phone's language is not auto-detected; Urdu only when chosen, remembered in the browser | Founder's request |
| 2026-09-30 | Urdu translations marked DRAFT (`"@@status"` in `ur.json`) | Must be reviewed by native speakers before launch |
| 2026-09-30 | Placeholder numbers are fake (`000-000-…`), not real numbers marked unverified | Testers can never call real emergency services by accident |
| 2026-09-30 | Emergency numbers fetched server-side at build + hourly refresh (Next.js revalidate), not from visitors' phones | Faster, works offline via the saved page, no visitor data reaches Supabase |
| 2026-09-30 | No Supabase JS library in the public pages (plain REST calls on the server) | Keeps pages light; supabase-js arrives with staff login (Phase 7) |
| 2026-09-30 | Safety plan: encrypted with a non-extractable browser key (Web Crypto AES-GCM, IndexedDB) | Meets "encrypted local storage"; honest limit: anyone using the same browser can open it until the PIN lock (discreet mode) exists |
| 2026-09-30 | Trusted-contact messages open the phone's SMS/WhatsApp app; the person sends them | Person confirms every time; Hifazat never sees or sends messages |
| 2026-09-30 | Location only when the person ticks "Add my current location"; shared as an OpenStreetMap link to their contact only | Location never goes to Hifazat or third parties unless the person shares it |
| 2026-09-30 | Changing a verified number automatically unpublishes it until re-verified (database trigger) | A wrong number can never silently go live |
| 2026-09-30 | Fonts self-hosted (Plus Jakarta Sans ≈ 30 KB; Nastaliq only on Urdu pages) | Professional look, still light; no requests to Google from visitors |
| 2026-09-30 | Urdu wording avoids gendered verbs (e.g. "رپورٹ درج کریں" instead of "رپورٹ کرنا چاہتا/چاہتی ہوں") | Inclusive; native reviewer to confirm |

## Reminders for later
- **All Urdu text is a first draft** by Claude: must be reviewed by a native speaker (and content by local experts) before launch.
- Seed phone numbers must stay `is_placeholder = true` until a human verifies them. Real numbers are entered via the Phase 7 admin screen (needs a named verifier account).
- The safety-step texts on "I'm in Danger" (step1–step4) and the checklist items need review by local experts.
- Discreet mode / PIN lock (brief §4, §6.10) is not built yet; plan it with Settings (suggest alongside Phase 6 or 7).
- Gilgit-Baltistan newer districts (Gupis-Yasin, Roundu, Darel, Tangir) to be added once their status is confirmed.
- The installed PWA's name and icon ("Hifazat", shield) are visible on the home screen and cannot change after install; consider whether a discreet name/icon option is needed (Phase settings / user research).
- Phase 9 / pre-launch: switch map tile provider; decide Vercel plan (Hobby is non-commercial); set `NEXT_PUBLIC_SHOW_PREVIEW_BANNER=false`; privacy page must mention Vercel (hosting) and Supabase (Singapore) as data processors; plus the "Before real launch" list in the brief §8.

## Notes for the developer (Claude)
- Web app commands (run in `apps/web`): `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm run check:i18n`, `npm run test:e2e` (builds the site itself, pointed at the stand-in Supabase `e2e/mock-supabase.mjs`).
- Database tests: start a local PostgreSQL, then `PGHOST=… PGPORT=… PGUSER=postgres supabase/tests/run-local.sh`. If the schema changes, regenerate `apps/web/e2e/fixtures/*.json` from the local DB (see git history of Phase 2).
- In the cloud workspace, Playwright's bundled browser version differs; run tests with
  `PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium npm run test:e2e`.
- `package.json` pins `electron-to-chromium` via `overrides` because one freshly published version was not downloadable; safe to remove later.
- Next.js 16 differs from older versions: read `apps/web/node_modules/next/dist/docs/` before using new APIs (see `apps/web/AGENTS.md`).
- Bump `VERSION` in `apps/web/public/sw.js` when changing what the offline helper saves.
- Flutter (paused): `apps/mobile`; the SDK is not part of the repo.
