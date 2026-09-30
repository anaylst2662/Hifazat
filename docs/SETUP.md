# Setup: Vercel and Supabase (nothing to install)

With the web-first plan, you **don't need to install anything** on your
computer. You test Hifazat by opening a link in your browser or on your phone.

Screens change often, so small differences from these steps are normal. Tell
me if something looks very different.

> **Golden rule:** never paste a *secret* key (Supabase service_role / secret
> key, Anthropic API key, database password) into a chat, an email, a code file,
> or Vercel.

---

## Part A — Create a free Vercel account and connect GitHub (about 10 minutes)

Vercel turns our code on GitHub into a website. Every time I push changes, it
builds a new version and gives you a link.

1. Go to <https://vercel.com/signup>.
2. Choose **Hobby** (free), type your name, and click **Continue**.
3. Click **Continue with GitHub** and sign in with the GitHub account that owns
   `anaylst2662/Hifazat`. Click **Authorize Vercel**.
4. On the Vercel dashboard, click **Add New…** → **Project**.
5. Under **Import Git Repository**, find **Hifazat** and click **Import**.
   - If you don't see it: click **Adjust GitHub App Permissions** (or
     **Configure GitHub App**), choose **Only select repositories**, pick
     **Hifazat**, click **Save**, and return to Vercel.
6. On the **Configure Project** screen:
   1. **Project Name:** `hifazat`
   2. **Framework Preset:** it should say **Next.js** automatically.
   3. **Root Directory:** click **Edit**, choose the folder **`apps/web`**, and
      click **Continue**. *(Important: this is where the web app lives.)*
   4. If you see the option **"Include files outside the root directory in the
      Build Step"**, make sure it is **on** (our translation files live outside
      `apps/web`). It is on by default.
   5. Open **Environment Variables**. If your Supabase project is ready, add:
      | Key | Value |
      |---|---|
      | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase **Project URL** |
      | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase **anon / publishable** key |

      If Supabase is not ready yet, skip this; the app does not use Supabase until
      Phase 2, and you can add them later under **Settings → Environment
      Variables**. **Never add the service_role / secret key here.**
7. Click **Deploy**. Wait 1–3 minutes until you see **Congratulations!**
8. Click **Continue to Dashboard**, then click the link under **Domains** (it
   looks like `hifazat-xxxx.vercel.app`). That's your Hifazat test site.
9. Send me the link, or tell me "Vercel connected".

### After that: how you get links for every change

- Every time I push, Vercel builds a new version automatically (1–3 minutes).
- In Vercel, open the **hifazat** project → **Deployments**. The top row is the
  newest version. Click it, then **Visit**.
- **Preview links are private by default.** Links for individual versions ask
  you to log in to Vercel. To show a tester, open the deployment and use
  **Share** to create a shareable link. The main `…vercel.app` address is
  public.
- The site shows a yellow **"Test version"** banner and asks search engines not
  to list it, until launch.

### A note on the free plan

Vercel's free **Hobby** plan is meant for non-commercial use. That is fine for
testing. **Before the public launch**, check whether Hifazat's organization
needs the **Pro** plan (about US$20/month). This is on the pre-launch checklist.

---

## Part B — Supabase project (about 15 minutes, if not done yet)

We start using Supabase in Phase 2. Region: **Singapore** (approved).

1. Go to <https://supabase.com> and click **Start your project**.
2. Sign up (using GitHub is easiest). Use an email the organization controls
   long-term.
3. Create an **organization** named `Hifazat`, plan **Free**.
4. Click **New project**:
   1. Name: `hifazat`
   2. **Database password:** click **Generate a password** and **save it in a
      password manager** (for example Bitwarden, free). Don't send it to me.
   3. **Region:** **Southeast Asia (Singapore)**.
   4. Click **Create new project** and wait a couple of minutes.
5. Find the **public** connection details:
   1. Click **Project Settings** (gear icon) → **API** / **API Keys** / **Data API**.
   2. Copy the **Project URL** (looks like `https://abcd1234.supabase.co`).
   3. Copy the **anon / publishable** key. This key is designed to be public;
      the database security rules protect the data.
   4. **Do NOT copy the `service_role` / `secret` key anywhere.**
6. Put both values into Vercel (Part A, step 6.5, or later under **Settings →
   Environment Variables**), then in **Deployments** click **⋯ → Redeploy** on
   the newest one so it picks them up.
7. Tell me **"Supabase project created"**. You can send me the Project URL
   (it's not secret).

---

## Part C — Add the Phase 2 tables to Supabase (about 5 minutes)

The "I'm in Danger" page reads its phone numbers from your Supabase database.
You add the tables once by copying two files into Supabase's SQL editor.

1. Open your project at <https://supabase.com/dashboard> and click **SQL Editor**
   in the left menu.
2. Click **New query** (or the **+** button).
3. In another tab, open the file on GitHub:
   `supabase/migrations/20260930120000_protect_contact_numbers.sql`
   (branch `claude/blissful-shannon-aep047`). Click the **Copy raw file** button
   (two overlapping squares, top right of the file).
4. Paste it into the SQL editor and click **Run** (or press Ctrl + Enter).
   You should see **"Success. No rows returned"**.
5. Click **New query** again. Copy the file `supabase/seed.sql` the same way,
   paste it, and click **Run**. This adds the **PLACEHOLDER** test numbers
   (fake `000-000-…` numbers that cannot reach anyone).
6. Check: click **Table Editor** in the left menu → `contact_numbers`. You should
   see 8 rows whose names start with **PLACEHOLDER**.
7. Make sure Vercel has your Supabase settings (Part A, step 6.5):
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
8. In Vercel → **Deployments** → newest row → **⋯** → **Redeploy**.
   After 1–3 minutes, "I'm in Danger" shows the test numbers with a
   **"TEST NUMBER"** label.

> Run each file **only once**. If you see an error such as "already exists",
> the step was already done; tell me and I'll check.
>
> **Real numbers:** don't type real numbers into the table yet. In Phase 7 you
> get an admin screen where a named person verifies each number (the database
> refuses a real number without `verified_by` and `verified_at`).

---

## Testing on your phone

1. Open the Vercel link in **Chrome** on your Android phone.
2. Try: the five home buttons, **Back**, the language switch (English ↔ اردو),
   **Quick Exit**, and the **"Staying safe online"** link at the bottom.
3. **Install it:** Chrome menu (⋮) → **Add to Home screen** / **Install app**.
4. **Offline test:** after opening the site once, turn on **Airplane mode** and
   open Hifazat from the home screen. The home page, "I'm in Danger" (with its
   numbers), "My Safety Plan" (with what you saved) and "Staying safe online"
   should still open.

---

## Later (not now)

- **Phase 6:** Anthropic account + API key for the AI assistant. The key goes
  into Supabase's secret storage, never into the web app or Vercel.
- **Flutter app (later):** installing Flutter on a computer, and a Google Play
  developer account.
