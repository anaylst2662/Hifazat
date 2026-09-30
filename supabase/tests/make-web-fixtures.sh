#!/usr/bin/env bash
# Regenerates the web app's test data (apps/web/e2e/fixtures/*.json) by running
# the real migrations + seeds on a local PostgreSQL and asking the database,
# as the public "anon" role, exactly what the website would ask.
# Usage: PGHOST=... PGPORT=... PGUSER=postgres supabase/tests/make-web-fixtures.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB=hifazat_fixtures
OUT=../apps/web/e2e/fixtures
mkdir -p "$OUT"
run() { psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$1"; }
dropdb --if-exists "$DB" 2>/dev/null; createdb "$DB"
run tests/00_supabase_shim.sql
for f in migrations/*.sql; do run "$f"; done
run seed.sql
run seed_awareness_samples.sql

query() { # $1 = output file, $2 = SQL returning one JSON value
  psql -q -d "$DB" -At -c "set role anon" -c "$2" |
    python3 -c "import json,sys; json.dump(json.load(sys.stdin), open('$OUT/$1','w'), ensure_ascii=False, indent=1)"
}
query contacts.json "select json_agg(t) from public.get_emergency_contacts() t"
query districts.json "select json_agg(t) from (select id,name_en,name_ur from public.districts order by sort_order) t"
query topics.json "select json_agg(t) from (select id,name_en,name_ur,icon from public.topics order by sort_order) t"
query audiences.json "select json_agg(t) from (select id,name_en,name_ur from public.audiences order by sort_order) t"
query awareness-en.json "select json_agg(t) from public.get_awareness_content('en') t"
query awareness-ur.json "select json_agg(t) from public.get_awareness_content('ur') t"
dropdb "$DB"
echo "Fixtures written to apps/web/e2e/fixtures/"
