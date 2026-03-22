# MillworkDatabase.com

Share, discover, and download architectural millwork designs for CNC cutting.

## Quick Start

### Prerequisites
- Node.js 20+
- Supabase account (free tier)
- GitHub account

### 1. Clone and install

```bash
cd app
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in order from `packages/db/migrations/`:
   - `001_initial_schema.sql` — Tables, types, indexes
   - `002_functions_triggers.sql` — Auto-update timestamps, search vectors, counters, gamification
   - `003_rls_policies.sql` — Row Level Security
   - `004_storage_buckets.sql` — Storage buckets and policies
3. Run the seed data: `packages/db/seeds/001_categories_styles_badges.sql`
4. Copy your project URL and keys from Settings → API

### 3. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL and keys
```

### 4. Run development server

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Run tests

```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## Deploy to Production

### Railway
1. Connect your GitHub repo to Railway
2. Set environment variables (from .env.local.example)
3. Railway auto-detects Next.js via `railway.toml`

### Cloudflare DNS
1. Add A record: `millworkdatabase.com` → Railway IP
2. Add CNAME: `www` → Railway domain
3. Enable SSL Full (Strict), HTTP→HTTPS redirect

### CI/CD
Push to `main` triggers: lint → type-check → test → build → deploy (via `.github/workflows/ci.yml`)

## Project Structure

```
app/
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   │   ├── (auth)/       # Login, register, forgot password
│   │   ├── (browse)/     # Public design browsing
│   │   ├── (protected)/  # Dashboard (requires auth)
│   │   ├── [username]/   # Public user profiles
│   │   └── api/          # REST API endpoints
│   ├── components/       # React components
│   ├── lib/              # Supabase clients, hooks, validators, utilities
│   ├── types/            # TypeScript type definitions
│   └── __tests__/        # Unit and integration tests
├── packages/db/          # SQL migrations and seed data
├── supabase/             # Supabase config and edge functions
└── .github/workflows/    # CI/CD pipeline
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Database | Supabase (PostgreSQL 15) |
| Auth | Supabase Auth (JWT) |
| Storage | Supabase Storage (images + 3D files) |
| Hosting | Railway |
| CDN/DNS | Cloudflare |
| CI/CD | GitHub Actions |
| Testing | Vitest, React Testing Library |

## Deferred Features (no cost until needed)

- **Stripe payments** — Architecture is in place, uncomment env vars when ready
- **3D viewer** — Three.js integration placeholder, add when first models are uploaded
- **Email notifications** — Add SendGrid/Resend when user base grows
- **ML auto-tagging** — Rule-based tagging active, ML can be added later
