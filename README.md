# Otatats Portfolio

Personal portfolio for John Anthony Otayco: a public, recruiter-facing site plus a private admin area for editing skills, experience, certifications, education and projects. Theme: automation, IT and cybersecurity, built with [React Bits](https://reactbits.dev) components.

Full spec: [`PORTFOLIO_SPEC.md`](./PORTFOLIO_SPEC.md).

## Stack

- Next.js 16 (App Router, TypeScript) + Tailwind CSS v4
- React Bits (vendored in `src/components/reactbits/`): DecryptedText, TextType, ShinyText, StarBorder, SpotlightCard, CountUp, LetterGlitch, TargetCursor
- Supabase `shared-backend` project, **`portfolio` schema only** (the `inner_mirror` schema belongs to Codex and is never touched)
- Hosting: Vercel

## Run locally

```bash
cp .env.example .env.local   # then fill in SUPABASE_SERVICE_ROLE_KEY and IP_HASH_SALT
npm install
npm run dev
```

Open http://localhost:3000 for the public site and http://localhost:3000/admin for the admin area.

## Admin access

The admin area uses an emailed sign-in link plus an authenticator app (TOTP). Because the Supabase auth users are shared with other apps, only users listed in `portfolio.admins` can edit. To grant access, sign in once, then in the Supabase SQL editor:

```sql
insert into portfolio.admins (user_id)
select id from auth.users where email = 'you@example.com';
```

The first visit to `/admin/mfa` shows a QR code to add to your authenticator app.

## Database

- `supabase/migrations/` holds the portfolio migrations (prefixed `portfolio_`), applied to `shared-backend`.
- `supabase/seed.sql` is the resume content already loaded into the database.
- Public visitors can read published rows only. Writes need an admin with MFA (row level security). Phone number, contact messages, share links and the audit log are never readable publicly.

## Deploy (Vercel)

1. Import this repository in Vercel (framework: Next.js), function region `sin1`.
2. Add the variables from `.env.example`; set `NEXT_PUBLIC_SITE_URL` to the production domain and mark `SUPABASE_SERVICE_ROLE_KEY` and `IP_HASH_SALT` as Sensitive.
3. In Supabase → Authentication → URL Configuration, add `https://<your-domain>/admin/auth/callback` to the redirect URLs (keep the ones Codex uses).
4. Add the domain under Vercel → Domains.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
