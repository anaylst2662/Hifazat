# Hifazat — Database Design (plain English)

This is the **plan** for the database. Nothing has been created yet. Once you
approve it, we create each part in the phase that needs it (as SQL files in
`supabase/migrations/`).

Every table has **Row Level Security (RLS)** switched on. That means the
database itself refuses to show or change a row unless a written rule allows
it — even if the app has a bug.

---

## 1. Who is who

| Person | Account? | What they can do |
|---|---|---|
| **Public user** | No | Read published content, verified directory and verified numbers. Submit a report (through a server function). Check their own report's status with reference number + private code. |
| **Public user with account** (optional) | Yes | Same as above, plus optional encrypted safety-plan backup, and "delete my account and data". |
| **Case worker** | Yes (staff) | See **only** reports routed to **their own** organization. Add notes and status updates. |
| **Organization manager** | Yes (staff) | Everything a case worker can do for their org, plus propose changes to their org's directory listing (needs admin approval). |
| **Content editor** | Yes (staff) | Write and edit Awareness Hub content and campaigns. Cannot publish without a review. |
| **Admin** | Yes (Hifazat team) | Verify organizations and numbers, review and publish content, manage staff and roles, see anonymized statistics. |

---

## 2. The tables

### A. People and roles

**`profiles`** — one row per account (staff, or a public user who chose to create one).
- `user_id`, `role` (public / case_worker / org_manager / content_editor / admin),
  `organization_id` (for staff), `preferred_language`, `created_at`.
- No names, phone numbers or addresses are stored for public users.

### B. Places

**`districts`** — the list of districts (starting with Gilgit-Baltistan: Gilgit,
Hunza, Nagar, Skardu, Shigar, Kharmang, Ghanche, Ghizer, Astore, Diamer, and newer
districts once confirmed). Later, other provinces are added the same way.
Used for filtering and for statistics.

### C. The verified directory (Find Help)

**`organizations`**
- Name, description, district, address, map location (latitude/longitude),
  languages spoken, opening hours, 24-hour emergency availability,
  website/email.
- `verification_status` (unverified / verified / suspended),
  `verified_by`, `verified_at`.
- **The public only sees organizations that are verified and published.**
- Development rows have names starting with **"PLACEHOLDER —"**.

**`organization_services`** — which services each organization gives:
medical, emotional support, legal information, safe accommodation, reporting
information, counseling, helpline.

**`contact_numbers`** — every phone number in the app (emergency services,
helplines, organization numbers).
- `label`, `number`, `kind` (emergency / helpline / organization),
  `organization_id` (if any), `district` (or national), `hours`,
  `is_placeholder`, `verified_by`, `verified_at`.
- **There are no phone numbers anywhere in the app code.** The app downloads
  this table and saves it on the phone for offline use.
- Development rows are marked `is_placeholder = true`, and the app shows a
  big **"NOT VERIFIED — TEST NUMBER"** banner for them.

**`listing_change_requests`** — when an organization manager edits their
listing, the change waits here until an admin approves it.

### D. Awareness Hub (Prevent)

**`topics`** — Consent, Boundaries, Harassment, Sexual violence, Domestic
violence, Stalking, Online safety, Child safety.

**`audiences`** — Girls & women, Boys & men, Parents, Teachers, Friends,
Community members.

**`content_items`** — one row per piece of content.
- `type`: article / infographic / video / faq / scenario / quiz.
- Links to topics and audiences.
- `status`: draft → in_review → published (or archived).
- `created_by`, `reviewed_by`, `reviewed_at`, `is_sample`.
- **The public only sees items that are published AND have a reviewer.**
  A database rule enforces this, not just the app.

**`content_translations`** — the actual words, one row per language
(English, Urdu; later Shina, Burushaski). Title, body, scenario question /
answer / "what can you do", image or video link.

**`quiz_questions`** and **`quiz_options`** — simple multiple-choice quizzes.
Quiz scores are kept **on the phone only**; we don't collect them.

**`campaigns`** — "Don't Let Fear Silence You", "No Means No", etc. Each has
translations and shareable images, with the same review and publish rules as
content.

### E. Reports (Report)

**`reports`**
- `reference_number` (short, easy to read, e.g. `HF-7K3Q-92XM`).
- `access_code_hash` — the private code is **never stored as plain text**;
  we store a scrambled version (a "hash"), like a password.
- `report_type` (sexual harassment, sexual assault, domestic violence,
  stalking, physical violence, threats, online harassment, child abuse, other).
- `mode`: anonymous / confidential / referral.
- `district` (optional), approximate date (optional), description.
- `routed_organization_id` — which verified organization receives it
  (confidential and referral modes).
- `status`: received → under review → referred → closed.
- `urgency` flag, `created_at`, `delete_after` (retention date).
- **Anonymous reports are marked "unverified information", never as an
  allegation.** There is no public listing of reports or of any named person,
  anywhere, ever.

**`report_contacts`** — for confidential and referral modes only: how the user
wants to be contacted. Kept in a **separate table with stricter rules**: only
the case workers of the routed organization can see it. Anonymous reports have
no row here.

**`report_attachments`** — list of files for a report. The files themselves
are in a **private storage bucket**. Photo metadata (including GPS location)
is removed on the phone **before** upload.

**`report_updates`** — status messages. Some are marked "visible to reporter"
(shown when they check status with their code); others are internal.

**`case_notes`** — internal notes by case workers. Never shown to the public.

### F. Accountability

**`audit_log`** — every time a staff member **opens** a report, views contact
details, downloads an attachment, or changes a status, a row is written:
who, what, which record, when. **Nobody can edit or delete audit rows**, not
even admins (the database refuses).

### G. Optional account features

**`safety_plan_backups`** — only if the user has an account AND turns backup on.
The plan is **encrypted on the phone** before upload, with a key derived from
a passphrase the user chooses. The server stores only scrambled data it
cannot read.

### H. AI assistant

**`ai_rate_limits`** — counts how many messages have been sent recently from a
device/account, so we can limit cost and abuse. **No message text is stored.**
The identifier is hashed.

---

## 3. File storage buckets

| Bucket | Public? | What's in it |
|---|---|---|
| `content-media` | Public (read) | Infographics, campaign images for sharing (only after publishing) |
| `report-attachments` | **Private** | Screenshots etc. attached to reports. Only the routed organization's case workers can download them, and each download is logged. |
| `org-verification` | **Private** | Documents organizations send to prove who they are. Admins only. |

---

## 4. Who can see what (the security rules, summarized)

| Data | Public | Case worker / Org manager | Content editor | Admin |
|---|---|---|---|---|
| Published, reviewed content | Read | Read | Read + edit drafts | Everything |
| Verified directory & numbers | Read | Read; propose edits to **own** org | Read | Everything |
| Reports | ❌ Only through the submit / status functions | **Only own organization's** | ❌ | ❌ by default* |
| Report contact details | ❌ | **Only own organization's** | ❌ | ❌* |
| Audit log | ❌ | ❌ | ❌ | Read only |
| Statistics | ❌ | Own org counts | ❌ | Anonymized counts only |

\* Admins manage the system, not cases. Admins see **statistics only**
(counts), not report contents. If an admin needs to route an unassigned
report, they see only its type, district and urgency — not its description.
This is a deliberate privacy choice; we can revisit it with your partner
organization.

**Statistics rule:** any number smaller than 5 is shown as "fewer than 5", so
nobody can be identified from small counts.

---

## 5. How long data is kept (to be finalized with legal advice)

| Data | Proposed default |
|---|---|
| Closed reports + attachments | Automatically deleted after a set period (placeholder: **12 months** after closing — to be decided with your partner organization and lawyer) |
| Reports never picked up | Flagged to admins; never silently deleted without a decision |
| Audit log | Kept longer than reports (placeholder: 3 years) |
| AI messages | **Not stored** |
| AI rate-limit counters | Deleted after 24 hours |
| Account deleted by user | Profile and safety-plan backup deleted immediately. Reports they submitted stay with the organization (they may be needed for safety), but are unlinked from the account. |

The app will show these periods to the user **before** they submit a report.
