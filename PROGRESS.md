# Hifazat — Progress Log

> Read this first when starting a new session. It records what is done, what
> is next, and every decision we made.

**Current phase:** Phase 0 — Setup & plan ✅ built, **waiting for founder approval**
**Working branch:** `claude/blissful-shannon-aep047`

---

## Done

### Phase 0 — Setup & plan
- Flutter project created (Android, iOS, web). Package id: `org.hifazat.hifazat`.
  Built and checked with Flutter 3.47.5 (stable) / Dart 3.13.4.
- Placeholder screen "Hifazat — setup complete" + one automated test.
- Supabase folder initialized (`supabase/config.toml`, `migrations/`, `functions/`).
- Secret protection: `.gitignore` blocks `.env`, signing keys; `.env.example` added.
- Documents written:
  - `docs/PLAN.md` — architecture, tech review, folder layout, phases, where secrets go
  - `docs/DATABASE.md` — database design and access rules in plain English
  - `docs/SETUP.md` — founder's step-by-step setup (computer + Supabase)

## Next

1. Founder: follow `docs/SETUP.md`, send `flutter doctor` output, create Supabase project.
2. Founder: approve (or change) the plan, the 6 adjustments in `docs/PLAN.md` §2,
   and the database design (especially the admin-can't-read-reports choice in
   `docs/DATABASE.md` §4 and retention placeholders in §5).
3. **Phase 1 — App shell:** home screen ("What do you need right now?"),
   navigation, Quick Exit, English/Urdu with RTL, theme and design system.

## Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-09-28 | Flutter + Supabase + Riverpod + flutter_map + Claude via Edge Function, as specified | Reviewed; all appropriate for a beginner-maintained project |
| 2026-09-28 | Staff dashboard = separate web-only entry point (`lib/main_dashboard.dart`) in the same project | Smaller, safer public app; no staff traces on users' phones *(pending approval)* |
| 2026-09-28 | Reports submitted only via an Edge Function, never direct table inserts | Anonymous users get no direct database write access *(pending approval)* |
| 2026-09-28 | Map tiles load only when the map is opened; switch to a launch-approved tile provider before release | OSM public tiles not allowed for heavy app use; privacy *(pending approval)* |
| 2026-09-28 | Admins see statistics, not report contents | Least privilege *(pending approval)* |
| 2026-09-28 | No push notifications / analytics / crash reporting in MVP | Data minimization |
| 2026-09-28 | Translations via Flutter's built-in ARB files (`gen-l10n`) | Standard; adding Shina/Burushaski = one new file |

## Reminders for later
- Phase 9: switch map tile provider; remind founder of the "Before real launch" list
  (partner organization, human verification of numbers, expert content review,
  legal advice, real-user testing in GB, honest response-time wording).
- All seed phone numbers must stay `is_placeholder = true` until a human verifies them.

## Notes for the developer (Claude)
- The cloud workspace installs Flutter at `/opt/sdk/flutter` (not in the repo).
- Checks to run before each commit: `flutter analyze`, `flutter test`.
