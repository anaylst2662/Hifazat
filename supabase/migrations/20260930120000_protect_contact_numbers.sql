-- =============================================================================
-- Phase 2 — PROTECT: districts and verified contact numbers
--
-- Plain English:
--   * "districts" lists places, starting with Gilgit-Baltistan.
--   * "contact_numbers" holds EVERY phone number the apps show. There are no
--     phone numbers in the app code.
--   * The public can only READ numbers that are published. Nobody can add or
--     change numbers from the app (admin tools come in Phase 7).
--   * A real (non-placeholder) number cannot exist without verified_by and
--     verified_at. If a number is changed, it is automatically unpublished and
--     marked unverified until a human verifies it again.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Districts
-- ---------------------------------------------------------------------------
create table public.districts (
  id          text primary key,              -- short code, e.g. 'gilgit'
  province    text not null,                 -- e.g. 'gilgit-baltistan'
  name_en     text not null,
  name_ur     text not null,                 -- DRAFT Urdu, to be reviewed
  sort_order  integer not null default 0,
  is_active   boolean not null default true
);

alter table public.districts enable row level security;

create policy "Anyone can read active districts"
  on public.districts for select
  to anon, authenticated
  using (is_active);

revoke all on public.districts from anon, authenticated;
grant select on public.districts to anon, authenticated;

-- Gilgit-Baltistan districts (names to be confirmed; newer districts such as
-- Gupis-Yasin, Roundu, Darel and Tangir can be added once their status is confirmed).
insert into public.districts (id, province, name_en, name_ur, sort_order) values
  ('gilgit',   'gilgit-baltistan', 'Gilgit',   'گلگت',   10),
  ('hunza',    'gilgit-baltistan', 'Hunza',    'ہنزہ',    20),
  ('nagar',    'gilgit-baltistan', 'Nagar',    'نگر',     30),
  ('skardu',   'gilgit-baltistan', 'Skardu',   'سکردو',   40),
  ('shigar',   'gilgit-baltistan', 'Shigar',   'شگر',     50),
  ('kharmang', 'gilgit-baltistan', 'Kharmang', 'کھرمنگ',  60),
  ('ghanche',  'gilgit-baltistan', 'Ghanche',  'گانچھے',  70),
  ('ghizer',   'gilgit-baltistan', 'Ghizer',   'غذر',     80),
  ('astore',   'gilgit-baltistan', 'Astore',   'استور',   90),
  ('diamer',   'gilgit-baltistan', 'Diamer',   'دیامر',  100);

-- ---------------------------------------------------------------------------
-- Contact numbers
-- ---------------------------------------------------------------------------
create type public.contact_kind as enum ('emergency', 'helpline', 'organization');

create table public.contact_numbers (
  id              uuid primary key default gen_random_uuid(),
  kind            public.contact_kind not null,
  label_en        text not null,
  label_ur        text not null,
  description_en  text,
  description_ur  text,
  phone           text not null check (phone ~ '^[0-9+][0-9 ()-]{2,24}$'),
  district_id     text references public.districts (id),  -- null = whole country
  organization_id uuid,                                   -- linked to organizations in Phase 4
  hours_en        text,
  hours_ur        text,
  is_24h          boolean not null default false,
  sort_order      integer not null default 0,
  -- Verification: a human must verify every real number before launch.
  is_placeholder  boolean not null default true,
  verified_by     uuid references auth.users (id),
  verified_at     timestamptz,
  is_published    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint real_numbers_must_be_verified
    check (is_placeholder or (verified_by is not null and verified_at is not null))
);

create index contact_numbers_published_idx
  on public.contact_numbers (is_published, district_id, kind, sort_order);

-- If the phone number (or who it belongs to) changes without a fresh
-- verification in the same update, take it offline until re-verified.
create function public.contact_numbers_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE'
     and (new.phone is distinct from old.phone
          or new.district_id is distinct from old.district_id
          or new.organization_id is distinct from old.organization_id)
     and new.verified_at is not distinct from old.verified_at then
    new.is_placeholder := true;
    new.verified_by := null;
    new.verified_at := null;
    new.is_published := false;
  end if;
  return new;
end;
$$;

create trigger contact_numbers_guard
  before insert or update on public.contact_numbers
  for each row execute function public.contact_numbers_guard();

alter table public.contact_numbers enable row level security;

create policy "Anyone can read published numbers"
  on public.contact_numbers for select
  to anon, authenticated
  using (is_published);

-- No insert/update/delete policies: the public apps can never change numbers.
revoke all on public.contact_numbers from anon, authenticated;
grant select on public.contact_numbers to anon, authenticated;

-- ---------------------------------------------------------------------------
-- The one function both apps (web now, Flutter later) use to get numbers.
-- Returns all published numbers: national ones first, then by district.
-- It runs with the caller's rights, so the security rules above still apply.
-- ---------------------------------------------------------------------------
create function public.get_emergency_contacts()
returns table (
  id uuid,
  kind public.contact_kind,
  label_en text,
  label_ur text,
  description_en text,
  description_ur text,
  phone text,
  district_id text,
  hours_en text,
  hours_ur text,
  is_24h boolean,
  is_placeholder boolean,
  verified_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, c.kind, c.label_en, c.label_ur, c.description_en, c.description_ur,
         c.phone, c.district_id, c.hours_en, c.hours_ur, c.is_24h,
         c.is_placeholder, c.verified_at
  from public.contact_numbers c
  where c.is_published
  order by (c.district_id is not null), c.kind, c.sort_order, c.label_en;
$$;

revoke all on function public.get_emergency_contacts() from public;
grant execute on function public.get_emergency_contacts() to anon, authenticated;
