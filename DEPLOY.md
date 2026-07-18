# Deploying to Vercel

This project is a pnpm monorepo with:
- **Frontend**: React + Vite (`artifacts/mcp-skill-generator`)
- **API**: Express serverless function (`api/index.ts`)
- **Database**: PostgreSQL (Drizzle ORM)

---

## Prerequisites

1. A **PostgreSQL** database accessible from Vercel functions.
   - Recommended: [Neon](https://neon.tech) (serverless Postgres, free tier, native Vercel integration)
   - Alternative: Supabase, PlanetScale, Railway

2. A **Clerk** account for authentication.
   - Go to [clerk.com](https://clerk.com) and create a project
   - Get your `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`

---

## Vercel Setup

### 1. Import the project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository (`hassan312-god/sturdy-tribble`)
3. Vercel auto-detects the `vercel.json` — leave framework as "Other"

### 2. Configure environment variables

In **Project Settings → Environment Variables**, add:

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | Neon/Supabase connection string |
| `CLERK_PUBLISHABLE_KEY` | `pk_live_...` | From Clerk dashboard |
| `CLERK_SECRET_KEY` | `sk_live_...` | From Clerk dashboard |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Same as CLERK_PUBLISHABLE_KEY |
| `VITE_CLERK_PROXY_URL` | _(leave empty)_ | Not needed on Vercel |
| `SESSION_SECRET` | Random 32+ char string | For session encryption |

### 3. Set up Clerk for production

In your Clerk Dashboard:
1. Go to **Configure → Domains** and add your Vercel domain (e.g. `your-app.vercel.app`)
2. Go to **Configure → Paths** and set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`

### 4. Run database migration

After first deploy, run the migration to create tables:

```bash
# Using Drizzle Kit locally with production DATABASE_URL
DATABASE_URL="your-neon-connection-string" pnpm --filter @workspace/db run push
```

Or seed templates:
```bash
DATABASE_URL="your-neon-connection-string" pnpm --filter @workspace/scripts run seed-skills
```

### 5. Deploy

Click **Deploy** in Vercel — the `vercel.json` handles everything:
- Builds the frontend from `artifacts/mcp-skill-generator`
- Routes `/api/*` to the Express serverless function
- Routes everything else to `index.html` (SPA)

---

## How it works on Vercel

```
User request
    │
    ├─ /api/* ──────→ api/index.ts (serverless function)
    │                       │
    │                       └─ Express app → PostgreSQL
    │
    └─ /* ──────────→ Static files (React SPA)
                            │
                            └─ Client calls /api/* for data
```

### Clerk proxy

On Replit, Clerk uses a proxy for key resolution from hostname. On Vercel, you set `VITE_CLERK_PUBLISHABLE_KEY` directly and the app uses it without a proxy. The `publishableKeyFromHost` call falls back gracefully.

---

## Local development

```bash
# Install dependencies
pnpm install

# Start everything
pnpm --filter @workspace/mcp-skill-generator run dev
pnpm --filter @workspace/api-server run dev

# Seed templates from GitHub repos
pnpm --filter @workspace/scripts run seed-skills
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `DATABASE_URL not set` | Add it to Vercel env vars |
| `Invalid Publishable Key` | Check CLERK_PUBLISHABLE_KEY matches your Clerk project |
| `CORS error on /api` | The `vercel.json` CORS headers cover this |
| Template pages 404 | Check the rewrite rule in `vercel.json` (SPA fallback) |
| `relation "templates" does not exist` | Run `drizzle-kit push` with prod DATABASE_URL |
