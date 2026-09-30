-- =============================================================================
-- DEVELOPMENT / TEST DATA ONLY — PLACEHOLDER NUMBERS
--
-- These are FAKE numbers (000...) so that nobody accidentally calls a real
-- emergency service while testing. The apps show a clear
-- "TEST NUMBER — NOT VERIFIED" warning for every row with is_placeholder = true.
--
-- Before launch: a human must replace every row with a real number, and record
-- verified_by and verified_at. See docs/SETUP.md.
-- =============================================================================

insert into public.contact_numbers
  (kind, label_en, label_ur, description_en, description_ur, phone, district_id,
   hours_en, hours_ur, is_24h, sort_order, is_placeholder, is_published)
values
  ('emergency', 'PLACEHOLDER — Police emergency', 'عارضی نمبر — پولیس ایمرجنسی',
   'Test number. Replace with the verified police emergency number.', 'آزمائشی نمبر۔ تصدیق شدہ نمبر سے بدلیں۔',
   '000-000-0001', null, '24 hours', '24 گھنٹے', true, 10, true, true),
  ('emergency', 'PLACEHOLDER — Rescue and ambulance', 'عارضی نمبر — ریسکیو اور ایمبولینس',
   'Test number. Replace with the verified rescue/ambulance number.', 'آزمائشی نمبر۔ تصدیق شدہ نمبر سے بدلیں۔',
   '000-000-0002', null, '24 hours', '24 گھنٹے', true, 20, true, true),
  ('helpline', 'PLACEHOLDER — Women''s support helpline', 'عارضی نمبر — خواتین کی مدد کی ہیلپ لائن',
   'Test number. Replace with a verified helpline.', 'آزمائشی نمبر۔ تصدیق شدہ ہیلپ لائن سے بدلیں۔',
   '000-000-0003', null, 'Hours to be confirmed', 'اوقات کی تصدیق باقی ہے', false, 10, true, true),
  ('helpline', 'PLACEHOLDER — Child protection helpline', 'عارضی نمبر — بچوں کے تحفظ کی ہیلپ لائن',
   'Test number. Replace with a verified helpline.', 'آزمائشی نمبر۔ تصدیق شدہ ہیلپ لائن سے بدلیں۔',
   '000-000-0004', null, 'Hours to be confirmed', 'اوقات کی تصدیق باقی ہے', false, 20, true, true),
  ('helpline', 'PLACEHOLDER — Emotional support helpline', 'عارضی نمبر — جذباتی سہارے کی ہیلپ لائن',
   'Test number. Replace with a verified helpline.', 'آزمائشی نمبر۔ تصدیق شدہ ہیلپ لائن سے بدلیں۔',
   '000-000-0005', null, 'Hours to be confirmed', 'اوقات کی تصدیق باقی ہے', false, 30, true, true),
  ('emergency', 'PLACEHOLDER — Gilgit police station', 'عارضی نمبر — گلگت پولیس اسٹیشن',
   'Test number for the district list.', 'ضلعی فہرست کے لیے آزمائشی نمبر۔',
   '000-000-0011', 'gilgit', '24 hours', '24 گھنٹے', true, 10, true, true),
  ('emergency', 'PLACEHOLDER — Skardu hospital emergency', 'عارضی نمبر — سکردو ہسپتال ایمرجنسی',
   'Test number for the district list.', 'ضلعی فہرست کے لیے آزمائشی نمبر۔',
   '000-000-0012', 'skardu', '24 hours', '24 گھنٹے', true, 10, true, true),
  ('emergency', 'PLACEHOLDER — Hunza police station', 'عارضی نمبر — ہنزہ پولیس اسٹیشن',
   'Test number for the district list.', 'ضلعی فہرست کے لیے آزمائشی نمبر۔',
   '000-000-0013', 'hunza', '24 hours', '24 گھنٹے', true, 10, true, true);
