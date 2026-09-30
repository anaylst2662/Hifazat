# Hifazat — حفاظت

**Don't Let Fear Silence You.** Learn. Prevent. Protect. Report. Support.

Hifazat is a digital safety, awareness, reporting and support platform,
starting in Gilgit-Baltistan, Pakistan.

- **Start here:** [PROGRESS.md](PROGRESS.md) — current status and decisions
- **The plan:** [docs/PLAN.md](docs/PLAN.md)
- **Database design:** [docs/DATABASE.md](docs/DATABASE.md)
- **Setup (Vercel, Supabase):** [docs/SETUP.md](docs/SETUP.md)
- **Original brief:** [docs/HIFAZAT_BUILD_PROMPT.md](docs/HIFAZAT_BUILD_PROMPT.md)

## Structure

| Folder | What |
|---|---|
| `apps/web` | Next.js web app (active) |
| `apps/mobile` | Flutter app (paused) |
| `supabase` | Database, security rules, server functions (shared) |
| `shared/i18n` | English and Urdu text (shared) |
| `ai` | AI assistant instructions |

## Web app commands (inside `apps/web`)

```
npm install          # once
npm run dev          # run locally at http://localhost:3000
npm run build        # production build
npm run test:e2e     # browser tests (after a build)
```
