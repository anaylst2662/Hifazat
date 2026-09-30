# Database tests

Plain SQL tests for the security rules (Row Level Security, grants, checks,
triggers). They run on a **local, throwaway** PostgreSQL, never on the real
Supabase project.

- `00_supabase_shim.sql` — recreates the few Supabase pieces the migrations need
  (roles `anon`/`authenticated`, `auth.users`, `auth.uid()`). **Local only.**
- `*.test.sql` — each block raises an error if a rule is broken, and prints
  `PASS: …` when it holds.
- `run-local.sh` — creates a temporary database, applies all migrations and the
  seed, runs every test, and deletes the database.
