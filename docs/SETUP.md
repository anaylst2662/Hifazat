# Setting up your computer and Supabase

Follow these steps once. Take your time, and tell me if any step looks
different on your screen. Screens change often, so small differences are normal.

> **Golden rule:** never paste a *secret* key (service_role key, Anthropic API
> key, database password) into a chat, an email, or a code file.

---

## Part A — Install the tools on your computer (about 1–2 hours, mostly downloading)

These steps are for **Windows**. If you use a Mac, tell me and I'll give you
Mac steps.

1. **Install Git** (saves the history of our work).
   1. Go to <https://git-scm.com/downloads> and download Git for Windows.
   2. Run the installer and keep clicking **Next** (the defaults are fine).

2. **Install Visual Studio Code** (the editor for viewing code).
   1. Go to <https://code.visualstudio.com> and click **Download for Windows**.
   2. Install it with the default options.

3. **Install Android Studio** (gives us the Android tools and a phone emulator).
   1. Go to <https://developer.android.com/studio> and download Android Studio.
   2. Install it and open it. Choose **Standard** setup and let it download
      everything (this takes a while).
   3. On the welcome screen, click **More Actions → SDK Manager → SDK Tools**
      tab, tick **Android SDK Command-line Tools**, click **Apply**.

4. **Install Flutter** (through VS Code — the easiest way).
   1. Open VS Code. Click the **Extensions** icon on the left (four small squares).
   2. Search for **Flutter**, and install the one by **Dart Code**.
   3. Press **Ctrl + Shift + P**, type **Flutter: New Project**, press Enter.
   4. VS Code will say the Flutter SDK was not found. Click **Download SDK**.
   5. Choose a simple folder such as `C:\dev` (avoid folders with spaces or
      special characters, and **not** inside `Program Files`).
   6. When asked, click **Add SDK to PATH**.
   7. Close and re-open VS Code. (You can cancel the "new project" — we already have one.)

5. **Check everything.**
   1. In VS Code, open the terminal: menu **Terminal → New Terminal**.
   2. Type `flutter doctor` and press Enter.
   3. If it asks to accept Android licenses, type
      `flutter doctor --android-licenses` and answer `y` to each question.
   4. **Copy the output of `flutter doctor` and send it to me.** (It contains no
      secrets.) I'll tell you if anything needs fixing. A red ✗ next to
      "Visual Studio" or "Xcode" is fine — we don't need those.

6. **Get the Hifazat code onto your computer.**
   In the VS Code terminal, type these one at a time:
   ```
   cd C:\dev
   git clone https://github.com/anaylst2662/Hifazat
   cd Hifazat
   git checkout claude/blissful-shannon-aep047
   code .
   ```
   The last command opens the project in VS Code.

7. **Run the app.**
   - **In a browser (quickest):** in the terminal type `flutter run -d chrome`.
   - **On your Android phone (best test):**
     1. On the phone: **Settings → About phone** → tap **Build number** 7 times
        to turn on Developer options.
     2. **Settings → System → Developer options** → turn on **USB debugging**.
     3. Connect the phone with a USB cable and tap **Allow** on the phone.
     4. In the terminal type `flutter devices` — your phone should appear.
     5. Type `flutter run` and choose your phone.
   - You should see a screen saying **"Hifazat — setup complete"**.

---

## Part B — Create the Supabase project (about 15 minutes)

We don't use Supabase inside the app until Phase 2, but it's good to set it up now.

1. Go to <https://supabase.com> and click **Start your project**.
2. Sign up (using GitHub is easiest). Use an email the organization controls
   long-term, not a personal one if possible.
3. Create an **organization** when asked. Name: `Hifazat`. Plan: **Free**.
4. Click **New project**:
   1. Name: `hifazat`
   2. **Database password:** click **Generate a password**, then **save it in a
      password manager** (for example Bitwarden, which is free). Do not send it
      to me.
   3. **Region:** choose **South Asia (Mumbai)** if available, otherwise
      **Southeast Asia (Singapore)**.
   4. Click **Create new project** and wait a couple of minutes.
5. Find your **public** connection details:
   1. Click **Project Settings** (gear icon) → **API** (it may be called
      **API Keys** / **Data API**).
   2. Note the **Project URL** (looks like `https://abcd1234.supabase.co`).
   3. Note the **anon / publishable** key. This key is designed to be inside
      apps; the database security rules protect the data.
   4. **Do NOT copy the `service_role` / `secret` key anywhere.** It bypasses
      all security rules.
6. Store them on your computer:
   1. In VS Code, in the Hifazat folder, find the file `.env.example`.
   2. Make a copy of it named exactly `.env` (right-click → Copy, then Paste,
      then rename).
   3. Put your Project URL and anon/publishable key into `.env` and save.
   4. `.env` is ignored by Git, so it will never be uploaded.
7. Tell me **"Supabase project created"** and which region you chose. You can
   send me the **Project URL** (it's not secret). You don't need to send the key.

---

## Part C — Later (not now)

- **Phase 6:** create an Anthropic account and API key for the AI assistant.
  I'll give you steps; the key goes into Supabase's secret storage, never into
  the app.
- **Phase 9:** create an Android signing key and a Google Play developer
  account.
