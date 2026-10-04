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
| Database | **Supabase Postgres** | Free tier, Row Level Security, a Supabase connector is already available to this project |
| Auth | **Supabase Auth** (email magic link or GitHub OAuth) + TOTP MFA | Single owner login, MFA fits the security theme |
| File storage | Supabase Storage (`public-assets` bucket) | Profile photo, project screenshots, resume PDF |
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
- **Visibility toggle** per item (`is_public`) so drafts can be prepared before showing them.
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
- Accent colour: Matrix green `#22c55e`, Cyber cyan `#06b6d4`, Alert amber `#f59e0b`.
- Background effect: FaultyTerminal / LetterGlitch / DotGrid / none.
- SEO: page title, meta description, Open Graph image.
- **Recruiter share links** (`/r/[token]`): create a link per recruiter/company, optional expiry, can reveal phone number, records view count and last viewed. Revoke anytime.

---

## 7. Data model (Supabase / Postgres)

```sql
profile (
  id uuid pk, full_name text, display_name text, headline text, summary text,
  location text, email text, phone text, linkedin_url text, github_url text,
  avatar_url text, resume_url text, target_role text,
  availability text check (availability in ('open','offers','closed')),
  updated_at timestamptz
)

skill_categories (id uuid pk, name text, icon text, sort_order int)

skills (
  id uuid pk, category_id uuid fk, name text, level int null, years numeric null,
  logo_url text null, is_public bool default true, sort_order int
)

experiences (
  id uuid pk, title text, company text, location text, employment_type text,
  start_date date, end_date date null, is_current bool,
  summary text, is_public bool default true, sort_order int
)

experience_bullets (id uuid pk, experience_id uuid fk, text text, sort_order int)
experience_skills (experience_id uuid fk, skill_id uuid fk)  -- tags

certifications (
  id uuid pk, name text, issuer text, code text null, issued_on date null,
  credential_url text null, badge_url text null, is_public bool, sort_order int
)

projects (
  id uuid pk, slug text unique, title text, tagline text, description text,
  live_url text, repo_url text null, image_url text, tags text[],
  is_featured bool, is_public bool, sort_order int
)

education (id uuid pk, degree text, school text, location text, start_year int, end_year int, sort_order int)

site_settings (
  id int pk default 1, accent text, background_effect text,
  show_phone bool default false, show_email bool default true, show_contact_form bool default true,
  seo_title text, seo_description text, og_image_url text
)

share_links (id uuid pk, token text unique, label text, reveal_phone bool, expires_at timestamptz, views int, last_viewed_at timestamptz, revoked bool)

contact_messages (id uuid pk, name text, email text, company text, message text, created_at timestamptz, is_read bool, ip_hash text)

audit_log (id bigserial pk, table_name text, row_id uuid, action text, before jsonb, after jsonb, at timestamptz)
```

### Row Level Security
- Public (anon) role: `SELECT` only on rows where `is_public = true`, and on `profile`/`site_settings` through a **view** that drops `phone` and private fields unless allowed.
- `contact_messages`: anon can `INSERT` only (via server action), never `SELECT`.
- Everything else: full access only when `auth.jwt() ->> 'email' = <owner email>` and `aal = 'aal2'` (MFA passed).

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
- **Palette:** background `#0a0f0d`, surface `#111915`, border `#1f2a24`, text `#e5f5ec`, muted `#8aa395`, accent (default) `#22c55e`, secondary `#06b6d4`, danger `#ef4444`.
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
  migrations/*.sql
  seed.sql                       # §8 content
middleware.ts                    # admin guard + security headers
```

---

## 12. Open items for the owner

1. **Convergys and Atos dates:** both show Jul 2017 – Apr 2018 on the resume. Confirm the Convergys dates.
2. **Employer for the SME and Engineer roles** (Mar 2025 – Oct 2025, Apr 2018 – Mar 2025) is not named. Confirm if it is Geidi IT Services.
3. **Perth on-site Jan–Apr 2025** overlaps the SME role (Mar 2025). Fine if it was an assignment during that role; the site can show it as a sub-entry.
4. **Codex tech stack** and a screenshot for the project card.
5. **Domain choice:** portfolio on `otatats.top` root or a subdomain.
6. **Profile photo** and certification badge images / verify links.

---

## 13. Milestones

| # | Milestone | Done when |
|---|---|---|
| 1 | Scaffold | Next.js + Tailwind + Supabase wired, deployed to Vercel preview |
| 2 | Public site (static seed) | All §4 sections render from `seed.sql`, React Bits components in place |
| 3 | Admin auth | Login + MFA + middleware guard + RLS policies |
| 4 | Admin CRUD | Profile, Skills, Experience, Certifications, Projects editable, ordering, visibility |
| 5 | Settings & share links | §6.3 complete, recruiter links tracked |
| 6 | Contact & hardening | Contact form, headers, security.txt, Lighthouse and security scan pass |
| 7 | Launch | Custom domain, analytics, LinkedIn updated with the link |
