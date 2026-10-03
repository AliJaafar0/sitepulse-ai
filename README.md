# SitePulse AI

A polished, full-stack website health monitor SaaS. It combines authentication, PostgreSQL, a website scanner, SEO/performance/accessibility/security checks, scan history, analytics, AI recommendations, settings, and an admin view in a focused product.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Cookie-based JWT authentication
- Recharts analytics
- Zod validation
- Optional OpenAI integration with a local deterministic fallback

## Run locally

1. Copy `.env.example` to `.env` and set `DATABASE_URL` + `AUTH_SECRET`.
2. Create an empty PostgreSQL database called `sitepulse` (or change the URL).
3. Install dependencies: `npm install`
4. Push schema: `npm run db:push`
5. Seed demo/admin data: `npm run db:seed`
6. Start: `npm run dev`
7. Open `http://localhost:3000`

Seed credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. The seeded account is also a normal user and has admin access.

## Production

Set the same environment variables in your host, use a managed PostgreSQL database, run `npm run db:push` during deployment, and then `npm run build && npm start`.

## Notes

The scanner intentionally uses server-side fetches, blocks private/local targets, follows redirects only through the URL returned by fetch, limits HTML size, and applies a timeout. This is a portfolio-grade scanner, not a replacement for Lighthouse or a dedicated security scanner.

If `OPENAI_API_KEY` is absent, AI recommendations are generated from the scan findings so the product remains functional with zero paid AI setup.
