@AGENTS.md

## Project notes
- Database: Supabase `shared-backend`, `portfolio` schema only. Never read, write or migrate `inner_mirror` (another app).
- New migrations go in `supabase/migrations/` with a `portfolio_` name and must keep RLS: public read of `is_published` rows, writes only via `portfolio.is_admin()`.
- `src/components/reactbits/` is vendored upstream code; it is excluded from lint.
