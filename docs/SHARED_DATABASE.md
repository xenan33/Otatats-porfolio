# Shared database: `shared-backend`

The portfolio shares one Supabase project (`hulggwtsktkoiaijzkhj`, ap-southeast-1) with
**Codex / The Inner Mirror** (codex.otatats.top). The two apps are kept apart by schema.
Audited 2026-10-04.

## Who owns what

| Area | Owner | Portfolio may… |
|---|---|---|
| `portfolio` schema (all tables, `is_admin()`, `is_admin_user()`) | Portfolio | Read and change freely, through `portfolio_*` migrations |
| `inner_mirror` schema (13 tables, 12 functions) | **Codex** | **Nothing.** Never read, write, grant, alter or migrate |
| `private.set_updated_at()` | **Shared** (used by triggers in both apps) | Use it in triggers. **Never alter or drop it** |
| `private.portfolio_audit()` | Portfolio | Change through `portfolio_*` migrations |
| `public` schema | Nobody (empty) | Leave empty |
| `auth` users | **Shared** login pool | Read own session only. Never delete or edit users |
| `storage` bucket `portfolio-assets` + its 3 policies | Portfolio | Change freely |
| Other storage buckets | Not portfolio's | Nothing |
| Auth settings (email templates, Site URL, redirect URLs, rate limits) | **Shared** | Only *add* portfolio redirect URLs. Don't change templates, Site URL or limits without checking Codex |

## Rules for portfolio work

1. Every migration lives in `supabase/migrations/`, has `portfolio` in its file name, and only touches the areas above that the portfolio owns. `npm run check:db` enforces the obvious cases and runs in CI.
2. The app's Supabase clients are pinned to the `portfolio` schema (`src/lib/env.ts`, `DB_SCHEMA`).
3. Admin rights come from `portfolio.admins`, never from "signed in". Codex users are signed in to the same pool.
4. Before any database change, re-run the audit queries below and compare.

## Known shared side effects

- **Auth emails:** the portfolio admin login uses Supabase's *Magic Link* email template. That template is shared with Codex; if Codex customises it, the portfolio login email changes too.
- **Auth email rate limits** are per project, so portfolio sign-in emails count against the same limit as Codex.
- **Database size** (13 MB at audit time) and connection limits are shared.

## Audit queries

```sql
-- Objects per schema
select n.nspname, c.relkind, count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname in ('portfolio','inner_mirror','private','public') group by 1,2 order by 1,2;

-- Anything portfolio-owned that mentions inner_mirror (should be empty)
select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname in ('portfolio','private') and pg_get_functiondef(p.oid) ~* 'inner_mirror';

-- Migration history: portfolio vs Codex
select version, name from supabase_migrations.schema_migrations order by version;
```
