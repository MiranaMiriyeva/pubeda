# Deploying Pabeda to production

You need **three free accounts**. Each takes about 3 minutes:

1. GitHub — <https://github.com/signup>
2. Neon (Postgres database) — <https://neon.tech>
3. Vercel (hosting) — <https://vercel.com>

Total time: about 15–20 minutes. All services are free tier.

---

## Step 1 — Push the code to GitHub

Open Terminal, cd into this folder, and run:

```bash
# Only needed once. If you already committed, skip these lines.
git add -A
git commit -m "Initial Pabeda site"

# Create an empty repo on github.com/new (name it "pubeda"), then:
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pubeda.git
git push -u origin main
```

If you already have a GitHub repo attached, just `git push`.

---

## Step 2 — Create the Neon database

1. Go to <https://console.neon.tech> and sign in (Google login is fastest).
2. Click **New Project**.
3. Name: `pubeda`. Region: **Europe (Frankfurt)**. Click **Create Project**.
4. You'll land on the project dashboard with a **Connection string** panel.
5. Turn the **Pooled connection** toggle **ON**.
   Copy the whole string starting with `postgresql://…-pooler.…` — this is your `DATABASE_URL`.
6. Turn the **Pooled connection** toggle **OFF**.
   Copy the new string (no `-pooler`) — this is your `DIRECT_URL`.

Keep this browser tab open — you'll paste both into Vercel in a moment.

---

## Step 3 — Deploy to Vercel

1. Go to <https://vercel.com/new>. Sign in with GitHub.
2. Click **Import** next to your `pubeda` repository.
3. Framework preset should auto-detect **Next.js** — leave everything as-is.
4. Expand **Environment Variables** and paste in **five** variables:

   | Name                  | Value                                                                        |
   | --------------------- | ---------------------------------------------------------------------------- |
   | `DATABASE_URL`        | The pooled URL from Neon (step 2.5)                                          |
   | `DIRECT_URL`          | The direct URL from Neon (step 2.6)                                          |
   | `AUTH_SECRET`         | Run `openssl rand -base64 32` in your terminal and paste the output          |
   | `ADMIN_EMAIL`         | The email you'll use to log into the admin panel                             |
   | `ADMIN_PASSWORD`      | A strong password — at least 12 characters                                   |
   | `NEXT_PUBLIC_SITE_URL`| Leave blank for now — you'll set this after the first deploy                 |

5. Click **Deploy**. Vercel will take 1–3 minutes to build.
6. When it finishes, you'll get a URL like `pubeda-xyz.vercel.app`.

The build runs `npm run build` which does:
- `prisma generate` — creates the DB client
- `prisma migrate deploy` — creates all tables in Neon
- `next build` — builds the site

The Prisma migrations happen automatically on every deploy.

---

## Step 4 — Seed the menu (one-time)

Your DB tables are now empty. Load the full menu + create the admin user:

**Option A (easiest — from your laptop):**

1. Copy `.env.example` to `.env` locally.
2. Paste the same `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` values.
3. Run:
   ```bash
   npm install
   npm run db:seed
   ```
4. You should see `✅ Seed complete`.

**Option B (from the Vercel CLI):**

```bash
npx vercel link          # answer y, pick the project
npx vercel env pull .env # downloads the env vars you just set
npm install
npm run db:seed
```

---

## Step 5 — Set the final site URL

1. In Vercel, go to your project → **Settings → Environment Variables**.
2. Edit `NEXT_PUBLIC_SITE_URL` and set it to your production URL,
   e.g. `https://pubeda-xyz.vercel.app` (no trailing slash).
3. Go to **Deployments → the latest → three dots → Redeploy**.

That's it. The site is live.

---

## Step 6 — Log in as admin

Open `https://YOUR-URL.vercel.app/admin/login` and log in with the
`ADMIN_EMAIL` + `ADMIN_PASSWORD` you set in step 3.

From there you can:
- Edit any menu item
- Add or remove categories
- Change theme colors, tagline, hours, contact info
- Drag to reorder categories and items
- Toggle items as unavailable when you run out of something

---

## Step 7 — Generate the QR code

1. Go to <https://www.qr-code-generator.com/> or any free QR generator.
2. Enter your menu URL: `https://YOUR-URL.vercel.app/menu`.
3. Download the PNG and print. Put it on tables, at the entrance, on receipts.

---

## Optional: Custom domain

1. In Vercel → **Settings → Domains → Add**.
2. Enter your domain (e.g. `pabeda.az`).
3. Vercel shows you DNS records to add at your domain registrar.
4. After DNS propagates (5 min – 24 h), the site is live at your domain.
5. Update `NEXT_PUBLIC_SITE_URL` to the new URL and redeploy.

---

## Updating the menu later

Two ways:

**From the admin panel (easy, no coding):**
Just log in and edit. Changes appear on the public menu within ~60 seconds.

**By editing the code (when you want to re-import the whole menu):**
Edit `prisma/menu-data.ts` locally, then run:
```bash
npm run db:studio     # optional — inspect your DB in the browser
npx tsx prisma/import-menu.ts --confirm   # WIPES current menu and re-imports
```

---

## Troubleshooting

- **Build fails with "Cannot resolve DATABASE_URL"** — one of the 5 env vars is missing in Vercel. Check Settings → Environment Variables.
- **Login says "Invalid credentials"** — re-run `npm run db:seed` locally after checking `.env` has the right `ADMIN_EMAIL`/`ADMIN_PASSWORD`. The seed re-hashes the password on every run.
- **Menu is empty but admin shows categories** — the public menu revalidates every 60 seconds. Wait a minute and refresh.
- **Colors don't update after saving in admin** — the layout renders the CSS variables server-side. Hit refresh (Cmd+R) to see the new colors.
- **Neon says "database is idle"** — Neon free tier auto-sleeps after 5 minutes. First request after a while takes 1-2 seconds to wake up. Later requests are fast.
