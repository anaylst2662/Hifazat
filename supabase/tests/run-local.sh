#!/usr/bin/env bash
# Runs the database tests on a throwaway local PostgreSQL database.
# Usage: PGHOST=... PGPORT=... PGUSER=postgres supabase/tests/run-local.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB=hifazat_test
dropdb --if-exists "$DB" && createdb "$DB"
psql -q -v ON_ERROR_STOP=1 -d "$DB" -f tests/00_supabase_shim.sql
for f in migrations/*.sql; do psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$f"; done
psql -q -v ON_ERROR_STOP=1 -d "$DB" -f seed.sql
for f in tests/*.test.sql; do echo "== $f"; psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$f" 2>&1 | sed 's/^psql:[^:]*:[0-9]*: //'; done
dropdb "$DB"
echo "All database tests passed."
