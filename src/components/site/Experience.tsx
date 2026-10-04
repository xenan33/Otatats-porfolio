import type { Experience as Role } from '@/lib/types';
import { Bullets, Section, formatMonth } from './ui';

type Company = { name: string; location: string | null; roles: Role[] };

// Roles grouped by employer, so progression inside one company reads as one story.
function byCompany(roles: Role[]): Company[] {
  const sorted = [...roles].sort((a, b) => Number(b.current) - Number(a.current) || b.start_date.localeCompare(a.start_date));
  const out: Company[] = [];
  for (const r of sorted) {
    const found = out.find((c) => c.name === r.company);
    if (found) found.roles.push(r);
    else out.push({ name: r.company, location: r.location, roles: [r] });
  }
  return out;
}

function span(roles: Role[]) {
  const start = roles.reduce((m, r) => (r.start_date < m ? r.start_date : m), roles[0].start_date);
  const ongoing = roles.some((r) => r.current);
  const end = ongoing ? null : roles.reduce<string | null>((m, r) => (r.end_date && (!m || r.end_date > m) ? r.end_date : m), null);
  return `${start.slice(0, 4)} – ${ongoing ? 'Present' : (end ?? '').slice(0, 4)}`;
}

export default function Experience({ roles }: { roles: Role[] }) {
  if (!roles.length) return null;
  const companies = byCompany(roles);
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <div className="space-y-6">
        {companies.map((c) => (
          <article key={c.name} className="grid gap-6 rounded-2xl border border-line bg-white p-6 sm:p-8 lg:grid-cols-[240px_1fr] lg:gap-10">
            <header>
              <h3 className="font-display text-xl font-semibold text-ink">{c.name}</h3>
              {c.location && <p className="mt-1 text-sm text-muted">{c.location}</p>}
              <p className="mt-3 inline-flex rounded-full bg-surface-2 px-3 py-1 font-mono text-xs text-accent-2">{span(c.roles)}</p>
            </header>
            <ol className="relative space-y-8 border-l border-line pl-6">
              {c.roles.map((r) => (
                <li key={r.id} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 ${r.current ? 'border-accent bg-accent' : 'border-line bg-white'}`}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="font-semibold text-ink">{r.title}</h4>
                    <p className="font-mono text-xs text-muted">
                      {r.current && <span className="mr-2 rounded-full bg-accent px-2 py-0.5 font-sans text-[11px] font-semibold text-white">Current</span>}
                      {formatMonth(r.start_date)} – {r.current ? 'Present' : formatMonth(r.end_date)}
                    </p>
                  </div>
                  <div className="mt-3">
                    <Bullets text={r.description} />
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </Section>
  );
}
