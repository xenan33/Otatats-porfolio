-- Portfolio admin, settings and supporting tables.
--
-- Scope: the `portfolio` schema of the shared-backend project, plus one
-- storage bucket (`portfolio-assets`) and a trigger helper in `private`.
-- Nothing belonging to other apps (e.g. `inner_mirror`) is touched.
--
-- Access model:
--   * anon / authenticated keep read access to published content only.
--   * Writes are allowed only for users listed in portfolio.admins whose
--     session has passed MFA (aal2). The auth user pool is shared with other
--     apps, so "authenticated" alone never grants anything.
--   * Private data (phone, contact messages, share links, audit log) is never
--     readable by anon; server code reads it with the service role.

-- ── Admins ──────────────────────────────────────────────────────────────────
create table portfolio.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table portfolio.admins enable row level security;

create or replace function portfolio.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from portfolio.admins a where a.user_id = auth.uid())
     and coalesce(auth.jwt() ->> 'aal', '') = 'aal2';
$$;
revoke execute on function portfolio.is_admin() from public, anon;
grant execute on function portfolio.is_admin() to authenticated;

-- Lets the admin UI tell "not an admin" apart from "MFA still needed".
create or replace function portfolio.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from portfolio.admins a where a.user_id = auth.uid());
$$;
revoke execute on function portfolio.is_admin_user() from public, anon;
grant execute on function portfolio.is_admin_user() to authenticated;

-- ── Profile additions ───────────────────────────────────────────────────────
alter table portfolio.profile
  add column target_role text,
  add column availability text not null default 'open'
    check (availability in ('open', 'offers', 'closed'));

-- Phone lives apart from the public profile so it can never leak through the
-- public read policy.
create table portfolio.profile_private (
  profile_id bigint primary key references portfolio.profile(id) on delete cascade,
  phone text,
  updated_at timestamptz not null default now()
);

-- ── Education ───────────────────────────────────────────────────────────────
create table portfolio.education (
  id bigint generated always as identity primary key,
  degree text not null,
  school text not null,
  location text,
  start_year integer,
  end_year integer,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Site settings (single row) ──────────────────────────────────────────────
create table portfolio.site_settings (
  id integer primary key default 1 check (id = 1),
  accent text not null default '#22c55e' check (accent ~ '^#[0-9a-fA-F]{6}$'),
  background_effect text not null default 'letter-glitch'
    check (background_effect in ('letter-glitch', 'dot-grid', 'none')),
  show_email boolean not null default true,
  show_phone boolean not null default false,
  show_contact_form boolean not null default true,
  seo_title text,
  seo_description text,
  og_image_url text,
  updated_at timestamptz not null default now()
);
insert into portfolio.site_settings (id) values (1);

-- ── Recruiter share links ───────────────────────────────────────────────────
create table portfolio.share_links (
  id uuid primary key default gen_random_uuid(),
  token text not null unique check (length(token) >= 24),
  label text not null,
  reveal_phone boolean not null default false,
  expires_at timestamptz,
  views integer not null default 0,
  last_viewed_at timestamptz,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Contact messages ────────────────────────────────────────────────────────
create table portfolio.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (length(name) between 1 and 200),
  email text not null check (length(email) between 3 and 320),
  company text check (company is null or length(company) <= 200),
  message text not null check (length(message) between 1 and 5000),
  ip_hash text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index contact_messages_created_idx on portfolio.contact_messages (created_at desc);
create index contact_messages_ip_idx on portfolio.contact_messages (ip_hash, created_at desc);

-- ── Audit log ───────────────────────────────────────────────────────────────
create table portfolio.audit_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  row_id text,
  action text not null,
  before jsonb,
  after jsonb,
  actor uuid,
  at timestamptz not null default now()
);
create index audit_log_at_idx on portfolio.audit_log (at desc);

create or replace function private.portfolio_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into portfolio.audit_log (table_name, row_id, action, before, after, actor)
  values (
    tg_table_name,
    coalesce((case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'id',
             (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'profile_id'),
    tg_op,
    case when tg_op = 'INSERT' then null else to_jsonb(old) end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end,
    auth.uid()
  );
  return coalesce(new, old);
end;
$$;
revoke execute on function private.portfolio_audit() from public, anon, authenticated;

-- ── Triggers ────────────────────────────────────────────────────────────────
create trigger education_set_updated_at before update on portfolio.education
  for each row execute function private.set_updated_at();
create trigger site_settings_set_updated_at before update on portfolio.site_settings
  for each row execute function private.set_updated_at();
create trigger profile_private_set_updated_at before update on portfolio.profile_private
  for each row execute function private.set_updated_at();

do $$
declare t text;
begin
  foreach t in array array['profile','profile_private','skills','experience','certifications',
                           'projects','education','site_settings','share_links','admins']
  loop
    execute format(
      'create trigger %I after insert or update or delete on portfolio.%I
         for each row execute function private.portfolio_audit()', t || '_audit', t);
  end loop;
end $$;

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table portfolio.profile_private enable row level security;
alter table portfolio.education enable row level security;
alter table portfolio.site_settings enable row level security;
alter table portfolio.share_links enable row level security;
alter table portfolio.contact_messages enable row level security;
alter table portfolio.audit_log enable row level security;

create policy "Published education is public" on portfolio.education
  for select to anon, authenticated using (is_published);
create policy "Site settings are public" on portfolio.site_settings
  for select to anon, authenticated using (true);

-- Admin (MFA-verified owner) full access on content and private tables.
do $$
declare t text;
begin
  foreach t in array array['profile','profile_private','skills','experience','certifications',
                           'projects','education','site_settings','share_links','contact_messages']
  loop
    execute format(
      'create policy "Admin full access" on portfolio.%I for all to authenticated
         using (portfolio.is_admin()) with check (portfolio.is_admin())', t);
  end loop;
end $$;

create policy "Admin can read audit log" on portfolio.audit_log
  for select to authenticated using (portfolio.is_admin());
create policy "Admin can read admins" on portfolio.admins
  for select to authenticated using (portfolio.is_admin());

-- ── Grants (least privilege; RLS decides rows) ──────────────────────────────
revoke all on portfolio.profile_private, portfolio.share_links, portfolio.contact_messages,
              portfolio.audit_log, portfolio.admins from anon;
grant select on portfolio.education, portfolio.site_settings to anon;
grant select, insert, update, delete on
  portfolio.profile, portfolio.profile_private, portfolio.skills, portfolio.experience,
  portfolio.certifications, portfolio.projects, portfolio.education, portfolio.site_settings,
  portfolio.share_links
  to authenticated;
grant select, update, delete on portfolio.contact_messages to authenticated;
grant select on portfolio.audit_log, portfolio.admins to authenticated;
grant all on all tables in schema portfolio to service_role;
grant usage, select on all sequences in schema portfolio to service_role, authenticated;

-- ── Storage bucket for portfolio images and resume ──────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-assets', 'portfolio-assets', true, 10485760,
        array['image/png','image/jpeg','image/webp','application/pdf']);

create policy "Portfolio admin can upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-assets' and portfolio.is_admin());
create policy "Portfolio admin can update" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-assets' and portfolio.is_admin())
  with check (bucket_id = 'portfolio-assets' and portfolio.is_admin());
create policy "Portfolio admin can delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-assets' and portfolio.is_admin());
