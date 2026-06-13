# Deployment

The app lives in the `veridian-peptides/` subdirectory of the repository.
It needs a PostgreSQL database and runs migrations on deploy.

## Required environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `APP_URL` | yes | Public base URL (payment redirects) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | seed only | Used by `pnpm db:seed` |
| `NOWPAYMENTS_API_KEY` | for live crypto | Card→stablecoin gateway |
| `NOWPAYMENTS_IPN_SECRET` | for live crypto | Webhook signature secret |
| `NOWPAYMENTS_PAY_CURRENCY` | optional | e.g. `usdttrc20` (default) |
| `PAYSERA_PROJECT_ID` | for live Paysera | Otherwise sandbox |

Without payment keys the app runs each provider in sandbox mode.

## Option A — Vercel

1. Import the repo and set **Root Directory** to `veridian-peptides`.
2. Add the env vars above (use a managed Postgres such as Neon/Supabase).
3. `vercel.json` runs `prisma generate && prisma migrate deploy && next build`.
4. After the first deploy, seed once: `pnpm db:seed` against the prod DB.

> The NOWPayments webhook URL is `https://<your-domain>/api/webhooks/nowpayments`.

## Option B — Fly.io

```bash
cd veridian-peptides
fly launch --no-deploy          # uses fly.toml + Dockerfile
fly postgres create             # or attach an external DB
fly secrets set DATABASE_URL=... APP_URL=https://<app>.fly.dev \
  NOWPAYMENTS_API_KEY=... NOWPAYMENTS_IPN_SECRET=...
fly deploy                      # release_command runs migrate deploy
```

## Option C — Railway

1. New project → Deploy from repo; set the service root to `veridian-peptides`.
2. Add a PostgreSQL plugin; Railway injects `DATABASE_URL`.
3. `railway.json` builds the Dockerfile and runs `migrate deploy` on start.
4. Set `APP_URL` and any payment secrets in the service variables.

## Local (Docker)

```bash
cd veridian-peptides
docker compose up --build       # app + postgres
# in another shell, seed the database:
docker compose exec app node node_modules/prisma/build/index.js db seed
```

## Post-deploy checklist

- [ ] Migrations applied (`prisma migrate deploy`)
- [ ] Database seeded (admin account created)
- [ ] `APP_URL` matches the public domain
- [ ] Payment provider keys set (or intentionally in sandbox)
- [ ] Webhook endpoint reachable and registered with the provider
- [ ] Replace template legal pages with reviewed copy
