import type { Certification, Education } from '@/lib/types';
import { Section } from './ui';

export default function Credentials({ certifications, education }: { certifications: Certification[]; education: Education[] }) {
  if (!certifications.length && !education.length) return null;
  return (
    <Section id="certifications" label="gpg --list-keys" title="Certifications & Education">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c) => (
          <div key={c.id} className="flex flex-col rounded-xl border border-line bg-surface/90 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{c.issuer ?? 'Certification'}</p>
            <h3 className="mt-2 font-medium leading-snug">{c.name}</h3>
            {c.credential_url && (
              <a
                href={c.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target mt-auto pt-4 font-mono text-xs text-accent-2 hover:underline"
              >
                verify ↗
              </a>
            )}
          </div>
        ))}
        {education.map((e) => (
          <div key={`edu-${e.id}`} className="rounded-xl border border-dashed border-line bg-surface/60 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-accent-2">Education</p>
            <h3 className="mt-2 font-medium leading-snug">{e.degree}</h3>
            <p className="mt-1 text-sm text-muted">
              {e.school}
              {e.location ? ` · ${e.location}` : ''}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
