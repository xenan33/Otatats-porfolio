import type { Certification, Education } from '@/lib/types';
import { Section } from './ui';

export default function Credentials({ certifications, education }: { certifications: Certification[]; education: Education[] }) {
  if (!certifications.length && !education.length) return null;
  return (
    <div className="section-tint">
      <Section id="certifications" eyebrow="Credentials" title="Certifications and education">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {certifications.length > 0 && (
            <ul className="divide-y divide-line tile rounded-2xl border">
              {certifications.map((c) => (
                <li key={c.id} className="flex items-center gap-4 p-5">
                  <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 font-display text-sm font-semibold text-accent-2">
                    {(c.issuer ?? c.name).slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug text-ink">{c.name}</p>
                    {c.issuer && <p className="text-sm text-muted">{c.issuer}</p>}
                  </div>
                  {c.credential_url && (
                    <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm font-semibold text-accent-text hover:text-accent-2">
                      Verify ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-4">
            {education.map((e) => (
              <div key={e.id} className="rounded-2xl bg-navy p-6 text-white dark:ring-1 dark:ring-navy-line">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky">Education</p>
                <p className="mt-3 font-display text-lg font-semibold leading-snug">{e.degree}</p>
                <p className="mt-2 text-sm text-white/70">
                  {e.school}
                  {e.location ? ` · ${e.location}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
