# Hifazat — Progress Log

> Read this first when starting a new session. It records what is done, what
> is next, and every decision we made. The original brief is in
> `docs/HIFAZAT_BUILD_PROMPT.md`.

**Current phase:** Phase 1b (redesign) ✅ built, **waiting for founder approval before Phase 2**
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

## Next

1. **Founder:** follow `docs/SETUP.md` Part A (Vercel), and Part B (Supabase) if not done.
2. **Founder:** test the redesign on phone and approve it (Phase 1b).
3. **Phase 2 — Protect & Safety Plan (web):** first database tables (districts,
   organizations, contact_numbers) with Row Level Security + PLACEHOLDER seed
   numbers; "I'm in Danger" page with call buttons from the database, saved for
   offline; trusted contacts + share message (user confirms each time);
   safety plan stored encrypted in the browser only, with a shared-device warning.

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
| 2026-09-30 | Fonts self-hosted (Plus Jakarta Sans ≈ 30 KB; Nastaliq only on Urdu pages) | Professional look, still light; no requests to Google from visitors |
| 2026-09-30 | Urdu wording avoids gendered verbs (e.g. "رپورٹ درج کریں" instead of "رپورٹ کرنا چاہتا/چاہتی ہوں") | Inclusive; native reviewer to confirm |

## Reminders for later
- **All Urdu text is a first draft** by Claude: must be reviewed by a native speaker (and content by local experts) before launch.
- Seed phone numbers must stay `is_placeholder = true` until a human verifies them.
- The installed PWA's name and icon ("Hifazat", shield) are visible on the home screen and cannot change after install; consider whether a discreet name/icon option is needed (Phase settings / user research).
- Phase 9 / pre-launch: switch map tile provider; decide Vercel plan (Hobby is non-commercial); set `NEXT_PUBLIC_SHOW_PREVIEW_BANNER=false`; privacy page must mention Vercel (hosting) and Supabase (Singapore) as data processors; plus the "Before real launch" list in the brief §8.

## Notes for the developer (Claude)
- Web app commands (run in `apps/web`): `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm run check:i18n`, `npm run test:e2e` (after a build).
- In the cloud workspace, Playwright's bundled browser version differs; run tests with
  `PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium npm run test:e2e`.
- `package.json` pins `electron-to-chromium` via `overrides` because one freshly published version was not downloadable; safe to remove later.
- Next.js 16 differs from older versions: read `apps/web/node_modules/next/dist/docs/` before using new APIs (see `apps/web/AGENTS.md`).
- Bump `VERSION` in `apps/web/public/sw.js` when changing what the offline helper saves.
- Flutter (paused): `apps/mobile`; the SDK is not part of the repo.
