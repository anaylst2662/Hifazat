-- =============================================================================
-- Phase 3 — PREVENT: Awareness Hub content
--
-- Plain English:
--   * topics and audiences organise the content.
--   * content_items: one row per article, infographic, video, FAQ, scenario
--     card, quiz or campaign. content_translations holds the words for each
--     language (English, Urdu; later Shina, Burushaski).
--   * Only content that is PUBLISHED and has a named REVIEWER can be seen by
--     the public. The database enforces this, not just the app.
--   * Changing the words of a published item sends it back to "in review"
--     until someone reviews it again.
--   * SAMPLE content (for development) can never be published. It is only
--     shown while the setting "show_sample_content" is on (test sites).
--     Before launch: turn that setting off and delete the samples.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Settings (small key/value switches the apps can read)
-- ---------------------------------------------------------------------------
create table public.app_settings (
  key        text primary key,
  value      jsonb not null,
  note       text,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
create policy "Anyone can read settings" on public.app_settings for select to anon, authenticated using (true);
revoke all on public.app_settings from anon, authenticated;
grant select on public.app_settings to anon, authenticated;

insert into public.app_settings (key, value, note) values
  ('show_sample_content', 'true',
   'TEST SITES ONLY. Shows SAMPLE (unreviewed) content with a SAMPLE label. MUST be false before launch.');

create function public.show_sample_content()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select value = 'true'::jsonb from public.app_settings where key = 'show_sample_content'), false);
$$;
revoke all on function public.show_sample_content() from public;
grant execute on function public.show_sample_content() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Topics and audiences
-- ---------------------------------------------------------------------------
create table public.topics (
  id         text primary key,          -- e.g. 'consent' (never shown in web addresses)
  name_en    text not null,
  name_ur    text not null,             -- DRAFT Urdu
  icon       text not null,             -- Lucide icon name, e.g. 'handshake'
  sort_order integer not null default 0
);

create table public.audiences (
  id         text primary key,          -- e.g. 'parents'
  name_en    text not null,
  name_ur    text not null,             -- DRAFT Urdu
  sort_order integer not null default 0
);

alter table public.topics enable row level security;
alter table public.audiences enable row level security;
create policy "Anyone can read topics" on public.topics for select to anon, authenticated using (true);
create policy "Anyone can read audiences" on public.audiences for select to anon, authenticated using (true);
revoke all on public.topics, public.audiences from anon, authenticated;
grant select on public.topics, public.audiences to anon, authenticated;

insert into public.topics (id, name_en, name_ur, icon, sort_order) values
  ('consent',         'Consent',                    'رضامندی',                   'handshake',       10),
  ('boundaries',      'Boundaries',                 'حدود',                      'shield',          20),
  ('harassment',      'Harassment',                 'ہراسانی',                   'megaphone-off',   30),
  ('sexual-violence', 'Sexual violence',            'جنسی تشدد',                 'heart-crack',     40),
  ('domestic',        'Domestic violence',          'گھریلو تشدد',               'house',           50),
  ('stalking',        'Stalking',                   'پیچھا کرنا',                'footprints',      60),
  ('online',          'Online safety',              'آن لائن تحفظ',              'smartphone',      70),
  ('child-safety',    'Child safety',               'بچوں کا تحفظ',              'baby',            80);

insert into public.audiences (id, name_en, name_ur, sort_order) values
  ('women',     'Girls & women',      'لڑکیاں اور خواتین', 10),
  ('men',       'Boys & men',         'لڑکے اور مرد',      20),
  ('parents',   'Parents',            'والدین',            30),
  ('teachers',  'Teachers',           'اساتذہ',            40),
  ('friends',   'Friends',            'دوست',              50),
  ('community', 'Community members',  'کمیونٹی کے افراد',  60);

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------
create type public.content_type as enum ('article', 'infographic', 'video', 'faq', 'scenario', 'quiz', 'campaign');
create type public.content_status as enum ('draft', 'in_review', 'published', 'archived');

create table public.content_items (
  id           uuid primary key default gen_random_uuid(),
  -- Short neutral code used in web addresses, e.g. /en/learn/k7p2qa
  code         text not null unique default substr(md5(gen_random_uuid()::text), 1, 6)
               check (code ~ '^[a-z0-9]{4,12}$'),
  type         public.content_type not null,
  topic_id     text not null references public.topics (id),
  status       public.content_status not null default 'draft',
  is_sample    boolean not null default false,
  is_core      boolean not null default false,   -- core guides are saved for offline use
  sort_order   integer not null default 0,
  created_by   uuid references auth.users (id),
  reviewed_by  uuid references auth.users (id),
  reviewed_at  timestamptz,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint published_needs_reviewer
    check (status <> 'published' or (reviewed_by is not null and reviewed_at is not null)),
  constraint samples_are_never_published
    check (not (is_sample and status = 'published'))
);

create table public.content_audiences (
  content_id  uuid not null references public.content_items (id) on delete cascade,
  audience_id text not null references public.audiences (id),
  primary key (content_id, audience_id)
);

-- A quiz is a list of questions: [{ "prompt": "...", "options": ["a","b",...],
-- "correct": 0, "explanation": "..." }, ...]
create function public.is_valid_quiz(quiz jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(quiz) = 'array'
     and jsonb_array_length(quiz) > 0
     and not exists (
       select 1 from jsonb_array_elements(quiz) q
       where jsonb_typeof(q -> 'prompt') <> 'string'
          or jsonb_typeof(q -> 'options') <> 'array'
          or jsonb_array_length(q -> 'options') < 2
          or jsonb_typeof(q -> 'correct') <> 'number'
          or (q ->> 'correct')::int < 0
          or (q ->> 'correct')::int >= jsonb_array_length(q -> 'options')
     );
$$;

create table public.content_translations (
  content_id         uuid not null references public.content_items (id) on delete cascade,
  lang               text not null check (lang ~ '^[a-z]{2,3}$'),   -- 'en', 'ur', later 'scl', 'bsk'
  title              text not null,
  summary            text,          -- one line shown on cards
  body               text,          -- plain text; blank line = new paragraph; "- " = bullet
  scenario_situation text,          -- scenario cards: the situation
  scenario_answer    text,          -- scenario cards: "Is this harassment?" answer
  scenario_actions   text,          -- scenario cards: "What can you do?"
  quiz               jsonb check (quiz is null or public.is_valid_quiz(quiz)),
  image_url          text check (image_url is null or image_url ~ '^(https://|/)'),  -- infographic / campaign poster
  image_alt          text,          -- description of the image for screen readers
  video_url          text check (video_url is null or video_url ~ '^https://'),
  share_text         text,          -- campaigns: text sent with the shared image
  updated_at         timestamptz not null default now(),
  primary key (content_id, lang)
);

create index content_items_visible_idx on public.content_items (status, is_sample, topic_id, sort_order);

-- updated_at, and "published_at" when first published.
create function public.content_items_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if new.status = 'published' and (tg_op = 'INSERT' or old.status <> 'published') then
    new.published_at := now();
  end if;
  return new;
end;
$$;
create trigger content_items_touch before insert or update on public.content_items
  for each row execute function public.content_items_touch();

-- Editing the words of a published item sends it back to review.
create function public.content_translations_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if (new.title, new.summary, new.body, new.scenario_situation, new.scenario_answer,
      new.scenario_actions, new.quiz, new.image_url, new.image_alt, new.video_url, new.share_text)
     is distinct from
     (old.title, old.summary, old.body, old.scenario_situation, old.scenario_answer,
      old.scenario_actions, old.quiz, old.image_url, old.image_alt, old.video_url, old.share_text) then
    update public.content_items
       set status = 'in_review', reviewed_by = null, reviewed_at = null
     where id = new.content_id and status = 'published';
  end if;
  return new;
end;
$$;
create trigger content_translations_guard before update on public.content_translations
  for each row execute function public.content_translations_guard();

-- ---------------------------------------------------------------------------
-- Who can see what
-- ---------------------------------------------------------------------------
create function public.content_is_visible(item public.content_items)
returns boolean
language sql
stable
set search_path = ''
as $$
  select (item.status = 'published' and item.reviewed_by is not null)
      or (item.is_sample and item.status <> 'archived' and public.show_sample_content());
$$;

alter table public.content_items enable row level security;
alter table public.content_audiences enable row level security;
alter table public.content_translations enable row level security;

create policy "Public sees published (or sample, on test sites) content"
  on public.content_items for select to anon, authenticated
  using (public.content_is_visible(content_items));

create policy "Public sees audiences of visible content"
  on public.content_audiences for select to anon, authenticated
  using (exists (select 1 from public.content_items c where c.id = content_id));

create policy "Public sees words of visible content"
  on public.content_translations for select to anon, authenticated
  using (exists (select 1 from public.content_items c where c.id = content_id));

-- No write policies: the public apps can never change content (editor tools: Phase 7).
revoke all on public.content_items, public.content_audiences, public.content_translations from anon, authenticated;
grant select on public.content_items, public.content_audiences, public.content_translations to anon, authenticated;

-- ---------------------------------------------------------------------------
-- The function both apps use: all visible content in one language
-- (falls back to English if a translation is missing).
-- Runs with the caller's rights, so the rules above always apply.
-- ---------------------------------------------------------------------------
create function public.get_awareness_content(p_lang text default 'en')
returns table (
  id uuid,
  code text,
  type public.content_type,
  topic_id text,
  audience_ids text[],
  is_sample boolean,
  is_core boolean,
  lang text,
  title text,
  summary text,
  body text,
  scenario_situation text,
  scenario_answer text,
  scenario_actions text,
  quiz jsonb,
  image_url text,
  image_alt text,
  video_url text,
  share_text text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, c.code, c.type, c.topic_id,
         coalesce(array(select a.audience_id from public.content_audiences a
                        where a.content_id = c.id order by a.audience_id), '{}'),
         c.is_sample, c.is_core,
         t.lang, t.title, t.summary, t.body,
         t.scenario_situation, t.scenario_answer, t.scenario_actions,
         t.quiz, t.image_url, t.image_alt, t.video_url, t.share_text
  from public.content_items c
  join lateral (
    select * from public.content_translations tr
    where tr.content_id = c.id and tr.lang in (p_lang, 'en')
    order by (tr.lang = p_lang) desc
    limit 1
  ) t on true
  join public.topics tp on tp.id = c.topic_id
  order by tp.sort_order, c.sort_order, t.title;
$$;

revoke all on function public.get_awareness_content(text) from public;
grant execute on function public.get_awareness_content(text) to anon, authenticated;
