#!/usr/bin/env bash
# Runs the database tests on throwaway local PostgreSQL databases.
# Each test file gets a fresh database with all migrations and seeds applied.
# Usage: PGHOST=... PGPORT=... PGUSER=postgres supabase/tests/run-local.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB=hifazat_test
run() { psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$1"; }

fresh_database() {
  dropdb --if-exists "$DB" 2>/dev/null
  createdb "$DB"
  run tests/00_supabase_shim.sql
  for f in migrations/*.sql; do run "$f"; done
  run seed.sql
  run seed_awareness_samples.sql
}

for test in tests/*.test.sql; do
  echo "== $test"
  fresh_database
  run "$test" 2>&1 | sed 's/^psql:[^:]*:[0-9]*: //'
done
dropdb "$DB"
echo "All database tests passed."
