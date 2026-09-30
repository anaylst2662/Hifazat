# Hifazat — Original Build Brief

> Saved word for word from the founder's first message (2026-09-28).
> **Change of plan (2026-09-30):** the web app (Next.js) is now built first and
> the Flutter mobile app is paused. See PROGRESS.md and docs/PLAN.md. Where this
> brief mentions Flutter, the same features and rules now apply to the web app
> first. All features, safety rules, principles and phases still apply.

---

## 1. Who you are working with

I am a non-technical founder and a beginner with coding tools. I will build this entire project with you (Claude Code). Please:

- Explain what you are doing in plain English before and after each step.
- Work in small phases. At the end of each phase, stop, summarize what was built, tell me exactly how to test it on my computer or phone, and wait for my approval.
- When I need to do something outside the code (create an account, get an API key, click something in a dashboard), give me numbered step-by-step instructions.
- Never put secret keys (API keys, passwords) inside the app code. Tell me where to store them safely.
- Choose simple, well-supported tools over clever ones. I need to be able to maintain this with your help.
- Keep a file called PROGRESS.md that records what is done, what is next, and any decisions we made, so we can continue in a new session.
- Use Git from the start and commit after every working step with a clear message.

## 2. What we are building

Hifazat (meaning "Safety / Protection") is a digital safety, awareness, reporting and support platform. Initial focus: Gilgit-Baltistan, Pakistan. Later: all of Pakistan.

Core message: **Don't Let Fear Silence You. Learn. Prevent. Protect. Report. Support.**

The model — four pillars:

- **PREVENT** — education, awareness, campaigns (the foundation)
- **PROTECT** — practical safety tools when someone is at risk
- **REPORT** — anonymous and confidential reporting
- **SUPPORT** — connection to verified human services

Philosophy: Before the danger: Educate. During the danger: Protect. After the danger: Support.
AI principle: AI guides. Humans help.
Privacy principle: Your safety. Your information. Your choice.
Non-blaming principle: Responsibility for violence belongs to the person committing it. Safety education gives people information and options; it never blames victims. All app wording must follow this.

## 3. Technology decisions

- Mobile app + web app: Flutter (one codebase for Android, iOS and web). Build Android first (most users in Pakistan use Android). The organization dashboard and admin panel are also Flutter web, inside the same project, shown only to logged-in staff.
- Backend: Supabase (database, login, file storage, security rules, server functions). Reason: it removes the need for me to run my own server.
- Use Postgres Row Level Security on every table.
- Sensitive files go in private storage buckets only.
- AI assistant: Claude API, called only from a Supabase Edge Function (server side), never directly from the app.
- Maps: a privacy-friendly option (e.g. OpenStreetMap via flutter_map). Do not send user location to any third party except when the user explicitly shares it.
- State management: pick one simple approach (Riverpod recommended) and use it consistently.
- Languages: English and Urdu in the MVP (Urdu is right-to-left — support RTL properly). Structure translations so Shina and Burushaski can be added later.

If you think any of these choices is wrong for a beginner, tell me why before changing it.

## 4. Safety and design rules (apply to every screen)

These are non-negotiable because users may be in danger:

- **Quick Exit** button visible on every sensitive screen. One tap instantly switches to a neutral screen (e.g. a weather or notes-style screen) and clears the current screen from the back history.
- **Emergency first.** The "I'm in Danger" flow never asks the user to log in or fill a form before showing emergency call buttons.
- **Works offline.** Emergency numbers, the safety plan, and core safety guides must be cached and work with no internet (Gilgit-Baltistan has weak connectivity). The app must be lightweight and fast on low-end Android phones.
- **No hardcoded helpline numbers.** All phone numbers and organizations live in the database with a verified_by, verified_at field. Seed the database with clearly marked PLACEHOLDER numbers. A human must verify every number before launch.
- **Discreet mode** (optional setting): the user can set a PIN lock on the app and hide notification previews.
- **Data minimization:** do not collect anything we do not need. Anonymous use must be possible for Learn, Danger, Find Help, and Anonymous Report.
- **Calm, simple UI:** large buttons, plain language, gentle colors, readable for people with low literacy. Use icons with every label.
- **Accessibility:** good contrast, scalable text, screen-reader labels.

## 5. Home screen

Title: **What do you need right now?**

| Button | Color | Goes to |
|---|---|---|
| 🔴 I'm in Danger | Red (largest, top) | Protect |
| 🟢 Learn & Stay Safe | Green | Prevent / Awareness Hub |
| 🟠 I Need Help | Orange | Support / Directory |
| 🟡 I Want to Report | Yellow | Report |
| 🔵 I'm Supporting Someone | Blue | Supporter guide |

## 6. Features for the MVP

### 6.1 PREVENT — Awareness Hub
- Content library organized by topic: Consent, Boundaries, Harassment, Sexual violence (basic info + where to get help), Domestic violence, Stalking, Online safety (cyberstalking, blackmail, image-based abuse), Child safety.
- Organized by audience: Girls & women, Boys & men, Parents, Teachers, Friends, Community members.
- Content types: short articles, infographics (images), short videos (links or uploaded), FAQs, and scenario cards ("Is this harassment?" → short situation → answer → "What can you do?").
- Simple quizzes.
- Campaigns section (e.g. "Don't Let Fear Silence You", "No Means No", "Speak Up. Support Others.", "Respect Boundaries.", "Safety Starts With Awareness.") with shareable images for WhatsApp and social media.
- All content is managed by admins from the dashboard (not hardcoded), so trained local experts can write and review it. Every item has a reviewed_by field and only reviewed content is published.
- For development, create a small amount of sample content clearly marked as SAMPLE — DO NOT PUBLISH.

### 6.2 PROTECT — I'm in Danger
- Big buttons to call emergency services and helplines (from the verified database, cached offline).
- One-tap message to trusted contacts via SMS/WhatsApp share, with optional location — the user must confirm each time.
- Short, calm safety instructions.
- Nearby verified help (from the directory/map).
- Quick Exit always visible.
- Important: the app does not dispatch police or guarantee a response. Make that honest in the wording.

### 6.3 My Safety Plan
- Trusted contacts, emergency numbers, safe places, transport options, important documents checklist, emergency items checklist, people I can call.
- Stored on the device only by default (encrypted local storage). Optional encrypted cloud backup only if the user creates an account and turns it on.

### 6.4 REPORT
- Report types: sexual harassment, sexual assault, domestic violence, stalking, physical violence, threats, online harassment, child abuse, other.
- Three modes, clearly explained before starting:
  - Anonymous — no account, no identity collected.
  - Confidential — identity shared only with a verified organization.
  - Referral with consent — user chooses a specific verified organization to contact them.
- User receives a report reference number and a private code to check status later without an account.
- Optional file attachments (screenshots etc.) stored encrypted in private storage; strip photo metadata (EXIF/location) before upload.
- Reports are never public. Anonymous reports are treated as unverified information, not as allegations against named people. No public listing of alleged perpetrators anywhere.
- Before submitting, show clearly: who will see this, what happens next, how long it is kept.

### 6.5 SUPPORT — Find Help
- "What do you need?" → Medical, Emotional support, Legal information, Safe accommodation, Reporting information, Counseling, Helpline, Find an organization.
- Verified directory: each organization shows services, location, languages, opening hours, contact info, emergency availability, and verification status.
- Map view of verified resources.
- Help the user understand options without pushing them toward any single decision.

### 6.6 I'm Supporting Someone
- Guide: listen, believe they deserve support, don't blame, don't pressure, don't force them to report, ask what they need, help find professional support, help reach emergency help if needed.
- Link to the directory and AI assistant.

### 6.7 AI Safety Assistant
- Chat screen powered by Claude via a Supabase Edge Function.
- It explains concepts, translates/simplifies content, helps navigate resources, and gives general safety information.
- It answers "where can I find help" questions only from Hifazat's verified directory (pass relevant database results into the prompt). It must not invent organizations or phone numbers.
- It must never claim to be a counselor, doctor, lawyer or the police.
- If a message suggests immediate danger or risk of self-harm, it responds with care and shows the emergency/helpline buttons from the verified database.
- It is warm, non-judgmental, never blames the user, and never pressures them to report.
- Write the system prompt for it in a separate file (ai/system_prompt.md) so it can be reviewed and improved.
- Do not store AI chat history on the server by default. Add rate limiting to control cost and abuse.

### 6.8 Organization Dashboard (web, staff only)
- Login for verified organization staff with roles: Admin, Organization manager, Case worker, Content editor.
- Case workers see only reports/referrals routed to their organization.
- Views: new referrals, urgent requests, pending cases, follow-ups, resource requests.
- Manage their own directory listing (changes need admin approval).
- Every time staff opens a report, log it (audit log).

### 6.9 Admin Panel (web)
- Verify organizations and phone numbers.
- Create, review and publish Awareness Hub content and campaigns.
- Manage users and roles.
- Simple anonymized statistics (counts by report type and district, support-request demand). Never show individual details in statistics; hide any number smaller than 5 to prevent identification.

### 6.10 Privacy & Settings
- Plain-language privacy page: what we collect, why, who can see it, when it is shared, how long it is kept, whether location is collected, whether identity is required.
- Language switch (English / Urdu).
- Delete my account and my data.
- Discreet mode and PIN lock.

## 7. Build phases (stop after each one)

- **Phase 0** — Setup & plan: check what is installed on my computer, help me install Flutter and set up Supabase, create the project structure, PROGRESS.md, Git. Show me the plan and database design in plain English.
- **Phase 1** — App shell: home screen, navigation, Quick Exit, English/Urdu with RTL, theme and design system.
- **Phase 2** — Protect & Safety Plan: I'm in Danger flow, trusted contacts, offline emergency numbers, safety plan on device.
- **Phase 3** — Awareness Hub: content library, scenario cards, quizzes, campaigns, offline caching.
- **Phase 4** — Directory & Map: verified organizations, Find Help flow, map.
- **Phase 5** — Reporting: three report modes, reference number, encrypted attachments, status check.
- **Phase 6** — Supporting Someone + AI Assistant.
- **Phase 7** — Web dashboard & Admin panel: roles, case views, content management, verification, statistics.
- **Phase 8** — Security & privacy review: check every Row Level Security rule, test that one organization cannot see another's data, test anonymous flows, remove debug logs that could contain sensitive info. Give me a written report of risks found.
- **Phase 9** — Release prep: build Android APK for testing, deploy the web app, and give me a pre-launch checklist.

## 8. Before real launch (remind me in Phase 9)

These are things code cannot solve. Remind me clearly:

- Partner with at least one established local organization (NGO, women's/child protection body, counseling service) before accepting real reports — someone trained must be on the other end.
- Have every helpline number and organization verified by a human.
- Have all educational content reviewed by qualified local experts and translated by native speakers.
- Get legal advice on data protection and reporting obligations in Pakistan (especially for child abuse reports).
- Test with real users from Gilgit-Baltistan, including people with low literacy and older phones.
- Decide who responds to reports, how fast, and what happens outside working hours — and say this honestly in the app.
