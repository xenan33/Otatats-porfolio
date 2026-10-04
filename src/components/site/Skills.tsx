import SpotlightCard from '@/components/reactbits/SpotlightCard';
import type { Skill } from '@/lib/types';
import { Section, rgba } from './ui';

const ICONS: Record<string, string> = {
  Cybersecurity: '🛡',
  'Identity & Cloud': '☁',
  Infrastructure: '🖧',
  Automation: '⚙',
  Leadership: '◎',
};

export default function Skills({ skills, accent }: { skills: Skill[]; accent: string }) {
  if (!skills.length) return null;
  const groups = new Map<string, Skill[]>();
  for (const s of skills) {
    const key = s.category ?? 'Other';
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  return (
    <Section id="skills" label="ls ./skills" title="Skills">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[...groups].map(([category, items]) => (
          <SpotlightCard key={category} spotlightColor={rgba(accent, 0.18)} className="!rounded-2xl !border-line !bg-surface/90 !p-6">
            <h3 className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-accent">
              <span aria-hidden="true">{ICONS[category] ?? '▸'}</span>
              {category}
            </h3>
            <ul className="mt-5 space-y-3">
              {items.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-ink/90">{s.name}</span>
                  {s.proficiency_label && (
                    <span className="shrink-0 font-mono text-[11px] uppercase text-muted">{s.proficiency_label}</span>
                  )}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
