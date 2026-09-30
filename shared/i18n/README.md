# Shared translations

All words shown to users live here, one file per language. Both the web app
(`apps/web`) and, later, the Flutter app (`apps/mobile`) read these files.

- `en.json` — English (the reference file: every key must exist here)
- `ur.json` — Urdu (right-to-left)

Rules:
- Keys are flat camelCase names (e.g. `homeTitle`) so Flutter's ARB tooling can
  use the same files later.
- Placeholders use `{name}` (ICU style), e.g. `"Planned for Phase {phase}."`
- Every language file must have exactly the same keys. `npm run check:i18n`
  (in `apps/web`) checks this.
- **Urdu text is a DRAFT** (`"@@status"` at the top of `ur.json`) and must be
  reviewed by native speakers before launch. Remove the DRAFT status only after
  that review. We avoid gendered verb forms (e.g. چاہتا / چاہتی) where possible.
- To add Shina or Burushaski later: copy `en.json`, translate, and register the
  new language code in the apps.
