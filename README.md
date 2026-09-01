# Pocket Ledger

Pocket Ledger is an installable Indian daily expense tracker with Daily, Weekly, Monthly and One-off ledgers, monthly budgets, merchant advances, credit limits and payment-mode analytics.

## Full-stack architecture

- React 19 and Vite frontend
- Express 5 same-origin API
- Better Auth email/password sessions
- Prisma ORM with SQLite for local development
- Zod request validation and transactional ledger snapshots
- Helmet security headers, trusted-origin checks, rate limiting and secure production cookies

All expense, archive, budget, payment-account and preference rows are owned by an authenticated user. Monetary values are persisted as integer paise. Existing browser-local data can be imported once after account creation; an existing cloud ledger cannot be overwritten through the import endpoint.

## Local development

Copy `.env.example` to `.env`, set a unique `BETTER_AUTH_SECRET` of at least 32 characters, then run:

```powershell
npm install
npm run db:generate
npm run db:deploy
npm run dev
```

The web app runs on `http://localhost:5173`; Vite proxies `/api` to the Express server on port 3001.

## Production

GitHub Pages remains suitable only for the previous static build. Database authentication requires a Node host with persistent storage and a single public origin serving both `dist/client` and `/api`.

Required environment variables are documented in `.env.example`. Set `NODE_ENV=production`, use an HTTPS `BETTER_AUTH_URL`, list only the production origin in `TRUSTED_ORIGINS`, build with `npm run build`, then start with `npm start`. Startup applies the committed SQLite migration idempotently before serving traffic. `npm run db:deploy:prisma` is retained for Prisma-managed deployment environments.

For password-reset and email-verification delivery, configure `RESEND_API_KEY` and `AUTH_EMAIL_FROM`. Until email delivery is configured, keep `REQUIRE_EMAIL_VERIFICATION=false`.

### Railway

The repository includes `railway.json`. Attach a volume at `/data` and set `DATABASE_URL=file:/data/pocket-ledger.db`. Railway supplies `PORT` and `RAILWAY_PUBLIC_DOMAIN`; the latter is used automatically for Better Auth's public URL and trusted origin. Set `BETTER_AUTH_SECRET` as a private variable and `NODE_ENV=production`, then generate a public domain for the service.
