# Sami's Daily Word — Setup Guide

A daily vocabulary app. Each day it shows one uncommon word. The next day, before the new word unlocks, you have to use yesterday's word in a sentence — and an AI checks whether you used it correctly. A flame at the top counts your day streak.

This guide assumes **zero coding experience**. Just follow the steps in order. The whole thing is free; the only cost is a few cents per *year* of AI usage, paid from your Anthropic credits.

You will set up three free accounts: **Anthropic** (the AI), **GitHub** (where the code lives), and **Vercel** (which puts it on the internet). Budget about 30 minutes.

---

## The files in this project

| File | What it is |
|------|-----------|
| `index.html` | The whole app — the screen, the words, the logic. |
| `api/judge.js` | A small private helper that asks the AI to grade a sentence. **Must stay inside a folder named `api`.** |
| `README.md` | This guide. |

---

## Part 1 — Get your AI key (Anthropic)

This key is what lets the app ask the AI to judge sentences. **Important:** the AI developer account is *separate* from a Claude.ai chat subscription, even if you pay for Claude. The credits have to live here.

1. Go to **https://console.anthropic.com** and sign up (or log in).
2. New accounts usually get a small amount of free credit. If you want a cushion, click **Billing** in the left menu and add $5 — it will last years.
3. In the left menu, click **API keys**.
4. Click **Create Key**. Give it a name like `sami-word`. Click create.
5. **Copy the key now** and paste it somewhere safe (a note to yourself). It starts with `sk-ant-`. You won't be able to see it again after you close the box.

> Keep this key private — anyone who has it can spend your credits. You'll paste it into Vercel later, and nowhere else.

---

## Part 2 — Put the app on the internet (free, forever)

### Step A — Create a GitHub account and project

1. Go to **https://github.com** and sign up for a free account.
2. After logging in, click the **+** in the top-right corner → **New repository**.
3. Under **Repository name**, type: `samis-daily-word`
4. Leave everything else as-is. Click the green **Create repository** button.

### Step B — Add the app files

You'll add two files. (You can skip the README if you like.)

**File 1 — index.html**
1. On your new repository page, click **Add file** → **Create new file**.
2. In the box at the top (the file-name box), type exactly: `index.html`
3. Open the provided `index.html` on your computer with any text editor (or the file preview), select **all** of its text, copy it, and paste it into the big text box on GitHub.
4. Scroll down, click the green **Commit changes…** button, then **Commit changes** again in the popup.

**File 2 — api/judge.js** (this is the one with the folder)
1. Click **Add file** → **Create new file** again.
2. In the file-name box, type exactly: `api/judge.js`
   — typing the `/` automatically creates the `api` folder for you. This matters; the app looks for it there.
3. Paste in all the text from the provided `api/judge.js`.
4. Click **Commit changes…** → **Commit changes**.

That's the code uploaded. ✅

### Step C — Put it online with Vercel

1. Go to **https://vercel.com** and click **Sign Up**.
2. Choose **Continue with GitHub** and approve the connection. (This is the easiest path — no separate password.)
3. On your Vercel dashboard, click **Add New…** → **Project**.
4. Find `samis-daily-word` in the list and click **Import**.
5. **Before clicking Deploy**, expand the **Environment Variables** section and add the AI key:
   - **Name** (sometimes called *Key*): `ANTHROPIC_API_KEY`  ← type it exactly, all capitals, no spaces.
   - **Value**: paste your `sk-ant-...` key from Part 1.
   - Click **Add**.
6. Now click the **Deploy** button.
7. Wait about a minute. When it says it's done, click **Continue to Dashboard**, then click the **Visit** button (or the screenshot) to open your live app.

You now have a web address like `https://samis-daily-word.vercel.app`. That's the app, live on the internet. 🎉

> **If the sentence-checker shows an error:** it's almost always the environment variable. In Vercel go to your project → **Settings** → **Environment Variables**, confirm the name is exactly `ANTHROPIC_API_KEY`, then go to the **Deployments** tab, click the **…** on the top deployment, and choose **Redeploy**.

---

## Part 3 — Put it on Sami's phone

Open the live web address **in the phone's browser**, then:

- **iPhone (Safari):** tap the **Share** button (the square with the up-arrow) → scroll down → **Add to Home Screen** → **Add**.
- **Android (Chrome):** tap the **⋮** menu (top-right) → **Add to Home screen** → **Add**.

It now sits on her home screen with its own icon and opens full-screen, just like a real app. Her streak and progress are saved on that phone.

---

## How to add your own words later

1. On GitHub, open your repository and click **`index.html`**.
2. Click the **pencil icon** (top-right of the file) to edit.
3. Find the list of words near the top (it starts at `const WORDS = [`).
4. Copy one full block — everything from a `{` to its matching `},` — and paste it right before the closing `];`. Then change the text. Template:

   ```
   { word:"Yourword", ipa:"/optional/", definition:"What it means.",
     example:"A sentence that shows the word in use.",
     origin:"Optional — where the word comes from.",
     didYouKnow:"Optional fun fact, or leave the quotes empty." },
   ```
   Keep the commas. `ipa`, `origin`, and `didYouKnow` are optional — leave them as `""` if you don't want them.
5. Click **Commit changes…** → **Commit changes**.
6. Vercel notices the change and updates the live app on its own within a minute. No other steps.

---

## Good to know

- **Cost:** judging one sentence costs about 1/600th of a dollar. One word a day is well under **$1 per year**.
- **Streak & progress** are stored on the phone itself. If she clears her browser data or switches phones, the streak restarts. (If you ever want progress to follow her across devices, that's a later upgrade we can add.)
- **The word order** is the order in the list. When it reaches the end, it loops back to the start.
- **Changing the AI model:** in `api/judge.js`, the line with `model:` controls which AI does the judging. `claude-haiku-4-5-20251001` is the cheapest. You can leave it.
