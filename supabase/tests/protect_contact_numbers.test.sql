-- Tests for Phase 2 security rules. Every block raises an error if a rule is broken.
\set ON_ERROR_STOP on

-- 1. The public (anon) sees only published numbers.
insert into public.contact_numbers (kind, label_en, label_ur, phone, is_published)
  values ('helpline', 'Hidden test row', 'پوشیدہ', '000-999-0000', false);
set role anon;
do $$ begin
  if exists (select 1 from public.contact_numbers where label_en = 'Hidden test row') then
    raise exception 'FAIL: anon can see an unpublished number';
  end if;
  if (select count(*) from public.get_emergency_contacts()) <> 8 then
    raise exception 'FAIL: expected 8 published placeholder numbers, got %', (select count(*) from public.get_emergency_contacts());
  end if;
  if (select district_id from public.get_emergency_contacts() limit 1) is not null then
    raise exception 'FAIL: national numbers should come first';
  end if;
  raise notice 'PASS: anon sees only published numbers, national first';
end $$;

-- 2. The public cannot add, change or delete numbers.
do $$ begin
  begin
    insert into public.contact_numbers (kind, label_en, label_ur, phone) values ('helpline', 'x', 'x', '123');
    raise exception 'FAIL: anon could insert';
  exception when insufficient_privilege then null; end;
  begin
    update public.contact_numbers set phone = '111';
    raise exception 'FAIL: anon could update';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.contact_numbers;
    raise exception 'FAIL: anon could delete';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.districts (id, province, name_en, name_ur) values ('x', 'x', 'x', 'x');
    raise exception 'FAIL: anon could add a district';
  exception when insufficient_privilege then null; end;
  raise notice 'PASS: anon cannot insert, update or delete';
end $$;
reset role;

-- 3. Same for logged-in users (staff roles and admin tools come in Phase 7).
set role authenticated;
do $$ begin
  begin
    update public.contact_numbers set phone = '111';
    raise exception 'FAIL: authenticated user could update';
  exception when insufficient_privilege then null; end;
  raise notice 'PASS: logged-in users cannot change numbers';
end $$;
reset role;

-- 4. A real number must be verified.
do $$ begin
  begin
    insert into public.contact_numbers (kind, label_en, label_ur, phone, is_placeholder)
      values ('helpline', 'Unverified real', 'x', '123', false);
    raise exception 'FAIL: a non-placeholder number was saved without verification';
  exception when check_violation then null; end;
  raise notice 'PASS: real numbers require verified_by and verified_at';
end $$;

-- 5. Changing a verified number takes it offline until re-verified.
insert into auth.users (id, email) values ('00000000-0000-0000-0000-00000000a0a0', 'verifier@example.org');
insert into public.contact_numbers (kind, label_en, label_ur, phone, is_placeholder, verified_by, verified_at, is_published)
  values ('helpline', 'Verified row', 'x', '123-456', false, '00000000-0000-0000-0000-00000000a0a0', now(), true);
update public.contact_numbers set phone = '999-999' where label_en = 'Verified row';
do $$ begin
  if exists (select 1 from public.contact_numbers
             where label_en = 'Verified row' and (is_published or not is_placeholder or verified_at is not null)) then
    raise exception 'FAIL: a changed number stayed published/verified';
  end if;
  raise notice 'PASS: changed numbers are unpublished until verified again';
end $$;

-- 6. Only active districts are visible.
update public.districts set is_active = false where id = 'diamer';
set role anon;
do $$ begin
  if exists (select 1 from public.districts where id = 'diamer') then
    raise exception 'FAIL: anon sees an inactive district';
  end if;
  if (select count(*) from public.districts) <> 9 then
    raise exception 'FAIL: expected 9 active districts';
  end if;
  raise notice 'PASS: only active districts are visible';
end $$;
reset role;
