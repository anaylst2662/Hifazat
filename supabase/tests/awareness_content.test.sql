-- Tests for Phase 3 (Awareness Hub) rules.
\set ON_ERROR_STOP on

insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000b1', 'reviewer@example.org');

-- A reviewed, published item and a draft, for the tests below.
insert into public.content_items (code, type, topic_id, status, reviewed_by, reviewed_at)
  values ('pub001', 'article', 'consent', 'published', '00000000-0000-0000-0000-0000000000b1', now());
insert into public.content_translations (content_id, lang, title)
  select id, 'en', 'Reviewed article' from public.content_items where code = 'pub001';
insert into public.content_items (code, type, topic_id, status) values ('drf001', 'article', 'consent', 'draft');
insert into public.content_translations (content_id, lang, title)
  select id, 'en', 'Secret draft' from public.content_items where code = 'drf001';

-- 1. Public sees published + samples (test-site setting on), never drafts.
set role anon;
do $$ begin
  if exists (select 1 from public.get_awareness_content('en') where code = 'drf001') then
    raise exception 'FAIL: public can see a draft';
  end if;
  if exists (select 1 from public.content_translations where title = 'Secret draft') then
    raise exception 'FAIL: public can read the words of a draft';
  end if;
  if not exists (select 1 from public.get_awareness_content('en') where code = 'pub001') then
    raise exception 'FAIL: published item not visible';
  end if;
  if (select count(*) from public.get_awareness_content('en') where is_sample) <> 10 then
    raise exception 'FAIL: expected 10 sample items while the setting is on';
  end if;
  raise notice 'PASS: public sees published and (test sites) sample content, never drafts';
end $$;

-- 2. Urdu is returned when present, English otherwise.
do $$ begin
  if (select lang from public.get_awareness_content('ur') where code = 'smp001') <> 'ur' then
    raise exception 'FAIL: Urdu translation not used';
  end if;
  if (select lang from public.get_awareness_content('ur') where code = 'pub001') <> 'en' then
    raise exception 'FAIL: no English fallback';
  end if;
  raise notice 'PASS: language with English fallback';
end $$;

-- 3. Public cannot write content.
do $$ begin
  begin
    update public.content_items set status = 'published';
    raise exception 'FAIL: anon could update content';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.content_translations (content_id, lang, title) select id, 'ur', 'x' from public.content_items limit 1;
    raise exception 'FAIL: anon could add a translation';
  exception when insufficient_privilege then null; end;
  begin
    update public.app_settings set value = 'true';
    raise exception 'FAIL: anon could change settings';
  exception when insufficient_privilege then null; end;
  raise notice 'PASS: public cannot change content or settings';
end $$;
reset role;

-- 4. Publishing needs a reviewer; samples can never be published.
do $$ begin
  begin
    update public.content_items set status = 'published' where code = 'drf001';
    raise exception 'FAIL: published without a reviewer';
  exception when check_violation then null; end;
  begin
    update public.content_items set status = 'published', reviewed_by = '00000000-0000-0000-0000-0000000000b1',
      reviewed_at = now() where code = 'smp001';
    raise exception 'FAIL: a SAMPLE item was published';
  exception when check_violation then null; end;
  raise notice 'PASS: publishing requires a reviewer; samples are never published';
end $$;

-- 5. Editing the words of a published item sends it back to review.
update public.content_translations set title = 'Changed title'
  where content_id = (select id from public.content_items where code = 'pub001');
do $$ begin
  if (select status from public.content_items where code = 'pub001') <> 'in_review'
     or (select reviewed_by from public.content_items where code = 'pub001') is not null then
    raise exception 'FAIL: edited item stayed published';
  end if;
  raise notice 'PASS: edits send published content back to review';
end $$;

-- 6. Turning the sample setting off hides all samples.
update public.app_settings set value = 'false' where key = 'show_sample_content';
set role anon;
do $$ begin
  if exists (select 1 from public.get_awareness_content('en') where is_sample) then
    raise exception 'FAIL: samples visible with the setting off';
  end if;
  raise notice 'PASS: samples disappear when show_sample_content is off';
end $$;
reset role;

-- 7. Quizzes must be well-formed.
do $$ begin
  begin
    insert into public.content_translations (content_id, lang, title, quiz)
      select id, 'ur', 'Bad quiz', '[{"prompt":"x","options":["a"],"correct":3}]'::jsonb
      from public.content_items where code = 'drf001';
    raise exception 'FAIL: a broken quiz was accepted';
  exception when check_violation then null; end;
  raise notice 'PASS: broken quizzes are rejected';
end $$;
