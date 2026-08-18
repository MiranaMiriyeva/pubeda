# PABEDA — QR menu website

A mobile-first, text-only QR-code menu for **Pabeda** (Pabeda Restoran), Baku.
Trilingual (Azerbaijani / Russian / English). Admin can edit menu items,
categories, prices, translations, contact info, and even the brand colors —
all without touching code.

---

## What this repo is

- **Public menu** at `/menu` — customers scan a QR code and browse
- **Landing page** at `/` — restaurant name, tagline, "View Menu" button, contact
- **Admin panel** at `/admin` — password-protected, edit everything

Stack: Next.js 16 (App Router) + React 19 + TypeScript, Tailwind v4, Prisma + Neon
Postgres, Auth.js v5, hosted on Vercel. All services are free-tier.

---

## First-time setup (one-time, ~20 minutes)

You will need three free accounts:

- **Neon** (free Postgres database) — <https://neon.tech>
- **Vercel** (free hosting) — <https://vercel.com>
- **GitHub** (free code hosting) — <https://github.com>

### 1. Create the Neon database

1. Go to <https://console.neon.tech> and sign up (use Google login for speed).
2. Click **New Project**.
3. Name it `pubeda`, region **Europe (Frankfurt)**, click **Create Project**.
4. On the project dashboard, you'll see a **Connection string** panel.
5. Click the **Pooled connection** toggle **ON** and copy the string starting with
   `postgresql://…-pooler.…` — this is your `DATABASE_URL`.
6. Toggle **Pooled connection** **OFF** and copy the second string (no `-pooler`) —
   this is your `DIRECT_URL`.

### 2. Set up your local `.env`

In this project folder, create a file named `.env` (copy from `.env.example`):

```bash
cp .env.example .env
```

Open `.env` and fill in:

- `DATABASE_URL` — the pooled string from step 1.5
- `DIRECT_URL` — the direct string from step 1.6
- `AUTH_SECRET` — run this in your terminal and paste the output:
  ```bash
  openssl rand -base64 32
  ```
- `ADMIN_EMAIL` — the email you'll use to log into `/admin`
- `ADMIN_PASSWORD` — a strong password (at least 12 characters)
- `NEXT_PUBLIC_SITE_URL` — leave as `http://localhost:3000` for now

### 3. Install and initialize

```bash
npm install
npm run db:migrate    # creates all tables in Neon
npm run db:seed       # loads full menu + creates admin user
npm run dev           # starts the local server
```

Open <http://localhost:3000> — you should see the landing page.
Open <http://localhost:3000/admin/login> and log in with your `ADMIN_EMAIL` /
`ADMIN_PASSWORD` to access the admin panel.

### 4. Add your logo

Drop your logo image at `public/logo.jpg` (or `.png`). Refresh the browser.

---

## Everyday admin

- **Change menu items** — go to `/admin`, click a category, edit any item.
- **Change contact / hours / tagline / description** — `/admin` → Settings.
- **Change brand colors** — `/admin` → Settings → theme colors. Changes apply
  after a page refresh.
- **Reorder items or categories** — drag-and-drop in the admin panel.
- **Add translations** — every text field has AZ / EN / RU inputs.

---

## Deploying to production (Vercel)

Covered in detail in Phase 9. Short version:

1. Push this repo to GitHub.
2. On <https://vercel.com>, **New Project → Import** the GitHub repo.
3. Under **Environment Variables**, paste in the same 5 variables from your
   `.env`.
4. Click **Deploy**.

Vercel will run `npm run build` which handles Prisma migrations automatically.

---

## Scripts reference

| Command              | What it does                                                |
| -------------------- | ----------------------------------------------------------- |
| `npm run dev`        | Start local dev server on port 3000                         |
| `npm run build`      | Generate Prisma client, apply migrations, build for prod    |
| `npm run start`      | Run the built production server                             |
| `npm run db:migrate` | Create a new migration and apply it (dev only)              |
| `npm run db:deploy`  | Apply existing migrations (production / CI)                 |
| `npm run db:seed`    | Load menu + create admin user (safe to re-run)              |
| `npm run db:studio`  | Open Prisma Studio — a database browser at localhost:5555   |

---

## File map

```
app/                Next.js pages (landing, /menu, /admin/*)
lib/                Shared helpers (Prisma client, i18n, settings, validators)
prisma/
  schema.prisma     Database schema
  seed.ts           Seeds admin + full menu + default settings
  menu-data.ts      Source of truth for categories and items (edit here to change seed)
  menu.raw.txt      Original menu text from the owner (for reference)
public/logo.jpg     Restaurant logo
proxy.ts            Next.js 16 middleware — rate-limits login, guards /admin
auth.ts             Auth.js v5 config
```

---

## Troubleshooting

- **"Cannot find module 'tsx'"** when running `db:seed` — run `npm install`.
- **Prisma migrate errors** — make sure `DIRECT_URL` is filled in and points to
  the non-pooled Neon connection string.
- **Can't log in to admin** — password is case-sensitive. Re-run
  `npm run db:seed` after updating `.env` to reset it.
- **Menu doesn't show my updates** — pages revalidate every 60 seconds; refresh.
