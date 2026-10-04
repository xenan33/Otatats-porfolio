# Otatats Portfolio — Website Spec

> Personal portfolio for **John Anthony Otayco** ("Jamo" / Otatats), IT Support Team Lead and cybersecurity practitioner.
> Theme: **Automation · IT Operations · Cybersecurity**.
> Design source: [React Bits](https://reactbits.dev/get-started/index).
> Repo: `github.com/xenan33/Otatats-porfolio`

---

## 1. Goals

1. Give recruiters and hiring managers a fast, credible, good-looking view of skills, experience, certifications and projects.
2. Let the owner edit all of that content from a private **admin area** without touching code.
3. Look like it belongs to someone in security and automation: dark, terminal-inspired, subtle motion, nothing gimmicky enough to hurt readability.
4. Support the career goal on the resume: progression into an **IT Security & Infrastructure Officer** role.

### Non-goals (v1)
- Blog / CMS for long-form writing (can be added in v2).
- Multiple admin users or roles.
- Comments, likes, or any user-generated public content.

---

## 2. Tech stack (default)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR/SSG for SEO, server actions for the admin, React Bits is React-native |
| Styling | **Tailwind CSS v4** | React Bits ships Tailwind (`-TW`) variants of every component |
| UI animations | **React Bits** + Framer Motion / GSAP (as required by chosen components) | Requested design system |
| Admin form primitives | shadcn/ui (inputs, dialogs, tables, toasts) | Pairs with Tailwind, same CLI as React Bits |
| Database | **Supabase `shared-backend` project** (`hulggwtsktkoiaijzkhj`, ap-southeast-1), **`portfolio` schema only** | Already exists with portfolio tables; shared with the Codex app, which lives in its own `inner_mirror` schema (see §7) |
| Auth | **Supabase Auth of `shared-backend`** (email magic link or GitHub OAuth) + TOTP MFA | The auth user pool is shared with Codex, so admin access is pinned to the owner's user id, never to "any authenticated user" |
| File storage | Supabase Storage, new bucket **`portfolio-assets`** (no buckets exist yet) | Profile photo, project screenshots, resume PDF; prefixed name so it can't clash with other apps |
| Hosting | **Vercel** | Zero-config Next.js, preview deploys per PR |
| Domain | `otatats.top` (portfolio at root or `portfolio.otatats.top`) | Sits next to `codex.otatats.top` |

Alternative if a database feels heavy: content stored as JSON in the repo and edited through the admin via the GitHub API. Not recommended for v1, because every edit becomes a commit and redeploy.

---

## 3. Site map

### Public (recruiter-facing)
| Route | Purpose |
|---|---|
| `/` | Single-page portfolio: Hero, About, Skills, Experience, Certifications, Projects, Contact |
| `/projects/[slug]` | Optional detail page per project (case-study style) |
| `/resume` | Inline resume view + "Download PDF" button |
| `/r/[token]` *(optional)* | Recruiter share link: same content, plus private fields such as phone number, and view tracking |

### Private (owner only)
| Route | Purpose |
|---|---|
| `/admin/login` | Sign-in (magic link / GitHub) + MFA challenge |
| `/admin` | Dashboard: profile completeness, last updated, recent contact messages, page views |
| `/admin/profile` | Name, headline, summary, location, avatar, social links, availability status |
| `/admin/skills` | CRUD skills and skill categories, drag to reorder, toggle visibility |
| `/admin/experience` | CRUD roles, bullet points, dates, drag to reorder, toggle visibility |
| `/admin/certifications` | CRUD certifications, badge image, credential URL |
| `/admin/projects` | CRUD projects (Codex is the first entry), featured flag |
| `/admin/messages` | Contact form inbox, mark read, archive |
| `/admin/settings` | Public visibility settings, theme accent, resume PDF upload, SEO metadata, share links |

---

## 4. Public site — sections and React Bits mapping

Component names below are from the React Bits catalog. Install each one through its component page ("CLI" tab) using the **TS + Tailwind** variant, for example:

```bash
npx shadcn@latest add https://reactbits.dev/r/DecryptedText-TS-TW
```

(Copy the exact command from each component page, since the registry URL format can change.)

### 4.1 Global
| Element | Component | Notes |
|---|---|---|
| Page background | **FaultyTerminal** *or* **LetterGlitch** | Green/cyan on near-black. Low intensity, paused when `prefers-reduced-motion` |
| Alternative calmer background | **DotGrid** / **Squares** | Use on admin and on mobile to save battery |
| Cursor | **TargetCursor** (desktop only) | Crosshair "lock-on" fits the security theme; off on touch devices |
| Navigation | **Dock** (desktop) / simple sheet menu (mobile) | Icons: Home, Skills, Experience, Projects, Contact |
| Click feedback | **ClickSpark** | Subtle, accent colour |

### 4.2 Hero
- Name in **DecryptedText** (scrambles in like a decrypt, then resolves to "John Anthony Otayco").
- Headline rotating via **TextType**: "IT Support Team Lead", "Cybersecurity Incident Response", "Automation with PowerShell & Power Automate", "Microsoft 365 & Azure AD".
- Status chip: "Open to IT Security & Infrastructure Officer roles" (toggle in admin).
- CTAs: **View Experience**, **Download Resume**, **Contact**. Primary CTA wrapped in **StarBorder** or **ElectricBorder**.
- Small terminal widget: fake prompt `jamo@otatats:~$ whoami` that prints the summary line (plain React, styled to match).

### 4.3 About
- Profile photo in **ProfileCard** (tilt + glow) with name, title, location "Cebu, Philippines", LinkedIn button.
- Summary paragraph revealed with **ScrollReveal** or **BlurText**.
- Key stats with **CountUp**: `7+` years in IT, `6` roles, `5` certifications, `10+` security tools.

### 4.4 Skills
- Layout: **MagicBento** grid, one tile per category, or **SpotlightCard** per category.
- Tool logos scrolling in **LogoLoop** (Microsoft 365, Azure, Huntress, Bitdefender, Proofpoint, Duo, PowerShell, Power Automate, Windows Server).
- Each skill shows name, category, optional proficiency (1–5 or Familiar / Proficient / Expert) and optional years.
- Seed categories and skills: see §8.

### 4.5 Experience
- Vertical timeline. Each role a **SpotlightCard**, animated in with **AnimatedContent** / **FadeContent**.
- Current role highlighted with a "CURRENT" badge (**ShinyText**).
- Bullets render as `>` terminal-style list items.
- Tags per role (e.g. `EDR/XDR`, `Incident Response`, `M365`) link to filter Skills.

### 4.6 Certifications
- Grid of **TiltedCard** or **PixelCard** tiles with badge image, issuer, date, "Verify" link (Credly/Microsoft Learn).

### 4.7 Projects
- Featured project first (see §5), others in **ChromaGrid** or **CardSwap**.
- Each card: title, one-liner, tech tags, live link, repo link (optional), screenshot.

### 4.8 Contact
- Form: name, email, company, message. Server action, stored in `contact_messages`, optional email notification (Resend).
- Spam protection: Cloudflare Turnstile + rate limit per IP.
- Links: email, LinkedIn. Phone hidden on the public page by default (see §6.3).

### 4.9 Footer
- `© 2026 Otatats` · "Built with Next.js & React Bits" · link to `codex.otatats.top`.
- Small "security.txt" link (`/.well-known/security.txt`), a nice touch for a security profile.

---

## 5. Featured personal project: Codex

| Field | Value |
|---|---|
| Title | **The Inner Mirror** (codex.otatats.top) |
| URL | https://codex.otatats.top |
| One-liner | A self-reflection web app inspired by Carl Jung's archetypes: explore twelve archetypes to understand your persona, shadow, and inner tensions. |
| Highlights | ~15 minute guided experience · no account required (optional sign-up) · reflections stored locally for 24 hours · guided questions, archetype analysis, journaling prompts |
| Positioning on the portfolio | Shows full-stack building, privacy-conscious design (local storage, short retention, no forced account), and product thinking beyond IT ops |
| Tags | `Web App`, `Privacy by design`, `UX`, plus the actual stack (owner to fill in admin) |
| Display | Featured, top of Projects, large card with live screenshot and "Visit site" CTA; optional iframe preview on the detail page |

*(Description taken from the live site on 2026-10-04; owner can edit the wording in the admin.)*

---

## 6. Admin / personal settings

### 6.1 Auth and access
- Only one allowed account: the owner's email, enforced server-side (allow-list env var `ADMIN_EMAIL`) **and** by RLS.
- Supabase Auth magic link or GitHub OAuth, plus **TOTP MFA required** for `/admin/*`.
- Next.js middleware redirects unauthenticated users from `/admin/*` to `/admin/login`.
- Session timeout: 12h; "Sign out everywhere" button.
- Audit log: every create/update/delete in admin writes a row to `audit_log` (who, what, when, before/after JSON).

### 6.2 Editing features
- CRUD forms for Profile, Skills, Experience, Certifications, Projects.
- **Drag-and-drop ordering** (dnd-kit) persisted as `sort_order`.
- **Visibility toggle** per item (`is_published`) so drafts can be prepared before showing them.
- Markdown support for summaries and bullets.
- Image upload to Supabase Storage (avatar, badges, project screenshots) with size/type validation.
- Resume PDF upload; `/resume` always serves the latest.
- "Preview as recruiter" button opens the public page with drafts hidden.
- After each save, revalidate the public page (`revalidatePath('/')`) so changes appear immediately.

### 6.3 Public settings (what recruiters see)
Managed in `/admin/settings`:
- Show/hide: phone number, email, location precision (city vs country), availability badge, contact form.
- Availability status: `Open to work` / `Open to offers` / `Not looking`.
- Target role text (default: "IT Security & Infrastructure Officer").
- Accent colour: Signature blue `#0a68e6` (default), Deep navy `#0b3b7a`, Teal `#0e7490`. Hero background: aurora or plain navy.
- Background effect: FaultyTerminal / LetterGlitch / DotGrid / none.
- SEO: page title, meta description, Open Graph image.
- **Recruiter share links** (`/r/[token]`): create a link per recruiter/company, optional expiry, can reveal phone number, records view count and last viewed. Revoke anytime.

---

## 7. Data model (Supabase `shared-backend`, schema `portfolio`)

### 7.1 Review of the shared database (done 2026-10-04)

| Schema | Owner / app | Contents | Portfolio may touch? |
|---|---|---|---|
| `portfolio` | **This website** (migration `portfolio_schema`, 2026-10-03) | `profile`, `skills`, `experience`, `certifications`, `projects`, all **empty**, RLS on, public read of `is_published = true` rows | **Yes, this is ours** |
| `inner_mirror` | Codex / The Inner Mirror (codex.otatats.top), live | 13 tables: assessments, results, journal entries, login codes, sessions, usage... | **No. Never read, write or migrate it** |
| `private` | Shared helper (migration `shared_foundation`) | `private.set_updated_at()` trigger function | Use the function only, don't change it |
| `public` | Unused | No tables | No, keep it empty |
| `auth` | Shared Supabase Auth | 1 user today, shared by both apps | Read own session only |
| `storage` | Shared | No buckets yet | Only the new `portfolio-assets` bucket |

Database size is 13 MB, far from any limit, so there's no capacity reason to split out. **A portfolio schema already exists, so no separate project or table set is created**; the site uses `portfolio.*` and any additions in §7.3 go into that same schema.

### 7.2 Existing tables (use as-is)

```sql
portfolio.profile        (id bigint identity pk, name, headline, bio, location, email,
                          linkedin_url, github_url, profile_image_url, resume_url,
                          is_published bool default true, created_at, updated_at)
portfolio.skills         (id, name, category text, proficiency_label text,
                          sort_order int, is_published, created_at, updated_at)
portfolio.experience     (id, company, title, location, description, start_date, end_date,
                          current bool, sort_order, is_published, created_at, updated_at)
portfolio.certifications (id, name, issuer, issue_date, expiry_date, credential_url,
                          description, sort_order, is_published, created_at, updated_at)
portfolio.projects       (id, title, slug unique (kebab-case check), description, long_description,
                          image_url, github_url, live_url, technologies text[], featured bool,
                          sort_order, is_published, created_at, updated_at)
```

Naming used by the existing tables: visibility flag → **`is_published`**, `is_current` → **`current`**, skill `level` → **`proficiency_label`** (Familiar / Proficient / Expert), skill categories are a **text column** (no separate table needed), experience bullets are stored as **Markdown in `experience.description`** (one `- ` line per bullet).

### 7.3 Additions needed (new migration, `portfolio` schema only)

Applied as one migration named `portfolio_admin_and_settings` when building milestone 3. Nothing outside `portfolio` (plus the new storage bucket) is created or altered.

```sql
-- Owner allow-list: who may edit. Pinned to a user id because auth users are shared with Codex.
create table portfolio.admins (user_id uuid primary key references auth.users(id) on delete cascade);

create or replace function portfolio.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from portfolio.admins where user_id = auth.uid())
     and coalesce(auth.jwt() ->> 'aal', '') = 'aal2';   -- MFA passed
$$;

-- Columns the spec needs on existing tables
alter table portfolio.profile add column phone text, add column target_role text,
  add column availability text check (availability in ('open','offers','closed')) default 'open';

create table portfolio.education (
  id bigint generated always as identity primary key, degree text not null, school text not null,
  location text, start_year int, end_year int, sort_order int default 0, is_published bool default true,
  created_at timestamptz default now(), updated_at timestamptz default now());

create table portfolio.site_settings (
  id int primary key default 1 check (id = 1), accent text default '#22c55e',
  background_effect text default 'faulty-terminal', show_phone bool default false,
  show_email bool default true, show_contact_form bool default true,
  seo_title text, seo_description text, og_image_url text, updated_at timestamptz default now());

create table portfolio.share_links (
  id uuid primary key default gen_random_uuid(), token text unique not null, label text,
  reveal_phone bool default false, expires_at timestamptz, views int default 0,
  last_viewed_at timestamptz, revoked bool default false, created_at timestamptz default now());

create table portfolio.contact_messages (
  id bigint generated always as identity primary key, name text not null, email text not null,
  company text, message text not null, ip_hash text, is_read bool default false,
  created_at timestamptz default now());

create table portfolio.audit_log (
  id bigint generated always as identity primary key, table_name text, row_id text,
  action text, before jsonb, after jsonb, actor uuid default auth.uid(), at timestamptz default now());

-- updated_at triggers reuse the shared helper: private.set_updated_at()
```

### 7.4 Security rules (RLS) for the shared database
- **Keep** the existing public `SELECT ... using (is_published)` policies.
- **Add** owner write policies on every portfolio table: `for all to authenticated using (portfolio.is_admin()) with check (portfolio.is_admin())`. Never use `to authenticated using (true)`: Codex users sign in to the same auth pool and would get edit rights.
- `profile.phone` must not leak through the public policy: public pages read through a view `portfolio.public_profile` that returns `phone` only when `site_settings.show_phone`, or through a share link resolved server-side.
- `share_links`, `contact_messages`, `audit_log`, `admins`: no anon access at all; the contact form inserts through a server action using the service role after Turnstile + rate limit.
- `site_settings`: anon `SELECT`, admin write.
- Storage bucket `portfolio-assets`: public read, write only when `portfolio.is_admin()`.
- After the migration, run Supabase security advisors and fix anything flagged.

### 7.5 App configuration
- Env: `NEXT_PUBLIC_SUPABASE_URL=https://hulggwtsktkoiaijzkhj.supabase.co`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key), `SUPABASE_SERVICE_ROLE_KEY` (server only, Vercel encrypted env).
- Supabase client created with `db: { schema: 'portfolio' }` so every query targets the portfolio schema by default.
- `portfolio` must be listed under **API settings → Exposed schemas** (alongside `inner_mirror`); confirm in the dashboard.
- Generated types: `supabase gen types typescript --project-id hulggwtsktkoiaijzkhj --schema portfolio`.
- Migrations live in this repo under `supabase/migrations/` and are prefixed `portfolio_`, so they're easy to tell apart from Codex's `inner_mirror_` migrations in the shared history.

---

## 8. Seed content (from resume)

### Profile
- **Name:** John Anthony Otayco
- **Headline:** IT Support Team Lead · Cybersecurity & Automation
- **Location:** San Fernando City, Cebu, Philippines
- **Email:** xenan03@gmail.com · **LinkedIn:** linkedin.com/in/xenotayco · **Phone:** hidden by default
- **Target role:** IT Security & Infrastructure Officer
- **Summary:** IT Support Team Lead with 7+ years of experience in Managed Service Provider (MSP) and enterprise environments. Currently part of the security team, actively involved in cybersecurity monitoring, incident response, vulnerability remediation, and secure infrastructure operations. Strong hands-on background in Microsoft 365, Active Directory, endpoint security, and patch management, with proven leadership in guiding engineers, handling escalations, and supporting security-driven initiatives.

### Skills (grouped)
| Category | Skills |
|---|---|
| **Cybersecurity** | Cybersecurity Incident Response · Threat & Vulnerability Management · Security Policy Enforcement · EDR/XDR (Huntress, Bitdefender) · Proofpoint, Endpoint & Email Security |
| **Identity & Cloud** | Microsoft 365 · Azure AD (Entra ID) · Active Directory |
| **Infrastructure** | Windows Server · Group Policy · Patch Management & Infrastructure Monitoring |
| **Automation** | PowerShell · Power Automate |
| **Leadership** | IT Operations Leadership · MSP & Client-Facing Support · Mentoring engineers |

### Experience
1. **IT Support Team Lead** — Geidi IT Services, Cebu, PH · Oct 2025 – Present
   - Lead and mentor IT support engineers in an MSP environment
   - Oversee daily operations, escalations, and incident response, including security-related incidents
   - Participate as part of the security team supporting threat monitoring and vulnerability remediation
   - Coordinate infrastructure projects, system upgrades, and security implementations
   - Collaborate with cybersecurity teams on EDR/XDR deployment and policy enforcement
   - Ensure patch management, system hardening, and compliance
2. **IT Support Engineer – Subject Matter Expert (Cybersecurity)** · Mar 2025 – Oct 2025
   - Senior escalation point for security monitoring, threat analysis, and incident response
   - Managed Proofpoint, Huntress, Bitdefender, and endpoint security solutions
   - Assisted with identity and access management and security policy implementation
   - Mentored junior engineers on secure troubleshooting practices
3. **IT Support Engineer (On-site Assignments)** — Perth, Australia · Sep 2023 – Dec 2023 and Jan 2025 – Apr 2025
   - Delivered onsite infrastructure and end-user support in business-critical environments
4. **IT Support Engineer** · Apr 2018 – Mar 2025
   - Administered Microsoft 365, Active Directory, Windows Server, and networking services
   - Managed patching, Group Policy, system configuration, and technical documentation
   - Responded to security alerts and assisted in risk remediation
   - Automated routine tasks using PowerShell and Power Automate
5. **Technical Helpdesk Analyst** — Atos, Cebu, PH · Jul 2017 – Apr 2018
   - AD password resets, Exchange management, and Windows support
   - Delivered customer-focused Tier 1–2 technical service
6. **Technical Support Representative** — Convergys, Cebu, PH · Jul 2017 – Apr 2018 *(dates as on resume, see §12)*
   - Assisted U.S. clients with broadband and home network support
   - Handled billing concerns and router/modem troubleshooting

### Education
- **BS Information Technology** — AMA University, Zamboanga City, PH

### Certifications
- SC-900: Microsoft Security, Compliance & Identity Fundamentals
- Microsoft Azure Fundamentals (AZ-900)
- Certified Duo Help Desk Administrator
- Google IT Support Specialization
- PL-900: Microsoft Power Platform Fundamentals

### Projects
- **The Inner Mirror** — codex.otatats.top (featured, see §5)
- Suggested additions the owner can fill in: PowerShell automation scripts (sanitised, on GitHub), Power Automate flows (onboarding/offboarding), a patch-compliance dashboard, a home lab write-up.

---

## 9. Visual design

- **Mode:** dark by default, optional light toggle.
- **Look (redesign, 2026-10-04):** clean and professional, no Matrix/terminal effects. Navy hero and contact bands around a white page; palette from the email signature: navy `#071a33`, signature blue `#0a68e6` (AA-safe), surface `#f4f7fb`, border `#dce4ee`, muted `#52627a`. Type: Sora (headings), IBM Plex Sans (body), IBM Plex Mono (dates). React Bits: Aurora (hero background), BlurText (name), ShinyText (availability), CountUp (snapshot), SpotlightCard (expertise, projects). Experience is grouped by employer.
- **Type:** headings `JetBrains Mono` or `Space Grotesk`; body `Inter`. Monospace used for labels, tags, dates.
- **Motifs:** terminal prompts, `[ OK ]` status tags, scanlines kept very faint, shield/lock/gear icons (lucide-react).
- **Motion rules:** max one heavy WebGL background per page; respect `prefers-reduced-motion` (swap to static gradient); lazy-load React Bits components below the fold with `next/dynamic`.

---

## 10. Non-functional requirements

### Performance
- Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO (mobile).
- Public pages statically generated and revalidated on admin save (ISR on demand).
- Images through `next/image`; WebGL backgrounds disabled on low-power / mobile by default.

### Accessibility
- WCAG 2.1 AA contrast on all text over animated backgrounds (add a dark overlay).
- All animated text has the final plain text in the DOM for screen readers (`aria-label`).
- Full keyboard navigation, visible focus rings.

### Security (part of the pitch, so it should be visibly done right)
- Strict security headers via `next.config` / middleware: CSP (nonce-based), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'` (except for the Codex preview if embedded).
- RLS on every table; service-role key used only server-side, never shipped to the client.
- Admin requires MFA; login rate limited; audit log on all writes.
- Input validation with Zod on every server action; Markdown sanitised (rehype-sanitize).
- Contact form: Turnstile + rate limit + IP stored only as a hash.
- `/.well-known/security.txt` published.
- Dependabot + `npm audit` in CI; DAST scan (e.g. OWASP ZAP or StackHawk) against the preview deploy before launch.
- Aim for an A on securityheaders.com and Mozilla Observatory and show the badges in the footer.

### SEO
- Metadata and Open Graph per page, JSON-LD `Person` schema with `jobTitle`, `knowsAbout`, `sameAs` (LinkedIn).
- `sitemap.xml`, `robots.txt` (disallow `/admin` and `/r/`).

### Analytics
- Privacy-friendly: Vercel Analytics or Plausible. Share-link views counted in the DB.

---

## 11. Project structure

```
app/
  (public)/page.tsx              # one-page portfolio
  (public)/projects/[slug]/page.tsx
  (public)/resume/page.tsx
  (public)/r/[token]/page.tsx
  admin/(auth)/login/page.tsx
  admin/(dashboard)/layout.tsx   # MFA-guarded
  admin/(dashboard)/{profile,skills,experience,certifications,projects,messages,settings}/page.tsx
  api/contact/route.ts
components/
  reactbits/                     # installed React Bits components
  sections/                      # Hero, About, Skills, Experience, ...
  admin/                         # forms, sortable lists
lib/
  supabase/{server,client}.ts
  validation/*.ts                # zod schemas
  actions/*.ts                   # server actions
supabase/
  migrations/portfolio_*.sql     # portfolio schema only (shared-backend)
  seed.sql                       # §8 content, inserts into portfolio.*
middleware.ts                    # admin guard + security headers
```

---

## 12. Hosting & deployment (Vercel)

### 12.1 Setup
| Item | Setting |
|---|---|
| Plan | **Hobby (free)**, which fits a personal, non-commercial portfolio. Move to Pro only if the site is ever used commercially or needs team access |
| Source | Import `github.com/xenan33/Otatats-porfolio` into Vercel; framework preset **Next.js** (auto-detected) |
| Production branch | `main`: every merge deploys to production |
| Preview deploys | Every pull request / other branch gets its own preview URL, used to check changes before merging |
| Function region | **`sin1` (Singapore)**, same region as the Supabase `shared-backend` project (ap-southeast-1), for the lowest database latency |
| Node version | Latest LTS supported by Vercel (match `engines.node` in `package.json`) |

### 12.2 Environment variables (Vercel → Project → Settings → Environment Variables)
| Name | Environments | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | `https://hulggwtsktkoiaijzkhj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | Publishable key, safe in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | **Production only** (mark **Sensitive**) | Server-only; never prefixed `NEXT_PUBLIC_`. Previews use the anon key + admin login instead |
| `ADMIN_EMAIL` | Production, Preview | Owner allow-list for `/admin` |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production, Preview | Contact-form spam protection |
| `RESEND_API_KEY` *(optional)* | Production (Sensitive) | Email notification on new contact messages |
| `IP_HASH_SALT` | Production, Preview (Sensitive) | Salt for hashing contact-form IPs |

Pull them locally with `vercel env pull .env.local`; `.env*` stays in `.gitignore`.

### 12.3 Domain
- Add the domain in Vercel → Project → Settings → Domains: `otatats.top` (plus `www.otatats.top` redirecting to it), or `portfolio.otatats.top` if the root is kept for something else.
- At the DNS provider, create the records Vercel shows on that page (an `A` record for the root, a `CNAME` for subdomains). Leave the existing `codex.otatats.top` record untouched.
- HTTPS certificates are issued and renewed automatically by Vercel.

### 12.4 Supabase Auth with Vercel
- In Supabase → Authentication → URL Configuration, set **Site URL** to the production domain and add redirect URLs for `https://<production-domain>/admin/**`, `https://*-xenan33s-projects.vercel.app/**` (previews; use the team slug Vercel shows) and `http://localhost:3000/**`.
- These are additions to the shared-backend auth settings: keep every existing redirect URL that Codex uses.

### 12.5 Security on Vercel
- **Deployment Protection:** turn on Vercel Authentication for **preview** deployments so unfinished versions and preview admin pages aren't public.
- Security headers (CSP, HSTS, etc., §10) set in `next.config.ts` / `middleware.ts` so they ship with every deploy; verify on the production URL with securityheaders.com.
- **Vercel Firewall:** add a rate-limit rule on `/admin/login` and `/api/contact`, and enable Attack Challenge Mode if the site is ever targeted.
- Sensitive env vars can't be read back from the dashboard once saved; rotate the Supabase service key if it is ever exposed.

### 12.6 Monitoring
- **Vercel Analytics** (privacy-friendly page views) and **Speed Insights** (real-user Core Web Vitals), both available on Hobby.
- Deploy notifications through the Vercel GitHub integration (status checks on each PR).

### 12.7 Release flow
1. Work on a branch, open a PR → Vercel posts a preview URL on the PR.
2. Check the preview (layout, admin login, Lighthouse).
3. Merge to `main` → production deploy.
4. Rollback if needed: Vercel → Deployments → previous deployment → **Instant Rollback**.
5. Database migrations (`supabase/migrations/portfolio_*.sql`) are applied to `shared-backend` **before** merging code that depends on them.

---

## 13. Open items for the owner

1. **Convergys and Atos dates:** both show Jul 2017 – Apr 2018 on the resume. Confirm the Convergys dates.
2. **Employer for the SME and Engineer roles** (Mar 2025 – Oct 2025, Apr 2018 – Mar 2025) is not named. Confirm if it is Geidi IT Services.
3. **Perth on-site Jan–Apr 2025** overlaps the SME role (Mar 2025). Fine if it was an assignment during that role; the site can show it as a sub-entry.
4. **Codex tech stack** and a screenshot for the project card.
5. **Domain choice:** portfolio on `otatats.top` root or a subdomain.
6. **Profile photo** and certification badge images / verify links.
7. **Owner account:** sign in once on the portfolio admin so your auth user id can be added to `portfolio.admins` (if the one existing auth user is you, it can be reused).
8. **Vercel account:** sign in to vercel.com with GitHub and confirm where `otatats.top` DNS is managed, so the domain records in §12.3 can be added.

---

## 14. Milestones

| # | Milestone | Done when |
|---|---|---|
| 1 | Scaffold | Next.js + Tailwind wired to `shared-backend` (`portfolio` schema), deployed to Vercel preview |
| 2 | Public site (static seed) | All §4 sections render from `seed.sql`, React Bits components in place |
| 3 | Admin auth | Login + MFA + middleware guard + §7.3 migration and §7.4 RLS policies |
| 4 | Admin CRUD | Profile, Skills, Experience, Certifications, Projects editable, ordering, visibility |
| 5 | Settings & share links | §6.3 complete, recruiter links tracked |
| 6 | Contact & hardening | Contact form, headers, security.txt, Lighthouse and security scan pass |
| 7 | Launch | Vercel production deploy on the custom domain (§12), analytics on, LinkedIn updated with the link |

---

## 15. Build status (2026-10-04)

Milestones 1–6 are implemented in the repo; milestone 7 (Vercel launch) is waiting on the owner's Vercel account and domain.

Differences from the plan above, decided during the build:
- **Phone number** lives in its own admin-only table `portfolio.profile_private` instead of a view, so it can never leak through the public read policy.
- **Contact form** uses a hidden honeypot field plus a 3-messages-per-hour limit per (hashed) IP. Cloudflare Turnstile can be added later if spam shows up.
- **Background:** LetterGlitch (no WebGL) instead of FaultyTerminal; it switches to a static dot grid on phones and for reduced-motion visitors.
- **Admin ordering** uses an "Order" number field rather than drag-and-drop (v2).
- **Not built yet:** ProfileCard, MagicBento, LogoLoop and Dock components, email notifications for new messages, blog (Phase 2).
