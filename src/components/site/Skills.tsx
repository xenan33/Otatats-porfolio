import SpotlightCard from '@/components/reactbits/SpotlightCard';
import type { Skill } from '@/lib/types';
import { Section, rgba } from './ui';

const ORDER = ['Cybersecurity', 'Identity & Cloud', 'Infrastructure', 'Automation', 'Leadership'];

export default function Skills({ skills, accent }: { skills: Skill[]; accent: string }) {
  if (!skills.length) return null;
  const groups = new Map<string, Skill[]>();
  for (const s of skills) {
    const key = s.category ?? 'Other';
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  const rank = (c: string) => (ORDER.includes(c) ? ORDER.indexOf(c) : ORDER.length);
  const sorted = [...groups].sort(([a], [b]) => rank(a) - rank(b));

  return (
    <div className="bg-surface">
      <Section
        id="expertise"
        eyebrow="Expertise"
        title="What I work with"
        intro="Tools and practices from day-to-day MSP and security work. Skills marked Expert are the ones I lead on."
      >
        <div className="gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {sorted.map(([category, items]) => (
            <SpotlightCard
              key={category}
              spotlightColor={rgba(accent, 0.1)}
              className="!rounded-2xl !border-line !bg-white !p-6 shadow-[0_1px_2px_rgba(7,26,51,0.04)]"
            >
              <h3 className="font-display text-lg font-semibold text-ink">{category}</h3>
              <ul className="mt-4 divide-y divide-line">
                {items.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
                    <span className="text-ink/85">{s.name}</span>
                    {s.proficiency_label === 'Expert' && (
                      <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-2">Expert</span>
                    )}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </div>
      </Section>
    </div>
  );
}
