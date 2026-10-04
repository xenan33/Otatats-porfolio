import ShinyText from '@/components/reactbits/ShinyText';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import type { Experience as Role } from '@/lib/types';
import { Bullets, Section, formatMonth, rgba } from './ui';

export default function Experience({ roles, accent }: { roles: Role[]; accent: string }) {
  if (!roles.length) return null;
  return (
    <Section id="experience" label="history | grep work" title="Experience">
      <ol className="relative space-y-6 border-l border-line pl-6 sm:pl-8">
        {roles.map((r) => (
          <li key={r.id} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[31px] top-7 h-3 w-3 rounded-full border-2 sm:-left-[39px] ${r.current ? 'border-accent bg-accent' : 'border-line bg-bg'}`}
            />
            <SpotlightCard spotlightColor={rgba(accent, 0.12)} className="!rounded-2xl !border-line !bg-surface/90 !p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="text-sm text-muted">
                    {r.company}
                    {r.location ? ` · ${r.location}` : ''}
                  </p>
                </div>
                <p className="font-mono text-xs text-muted">
                  {r.current ? (
                    <ShinyText text="CURRENT" color={accent} shineColor="#ffffff" speed={2.5} className="mr-2 font-semibold" />
                  ) : null}
                  {formatMonth(r.start_date)} – {r.current ? 'Present' : formatMonth(r.end_date)}
                </p>
              </div>
              <div className="mt-4">
                <Bullets text={r.description} />
              </div>
            </SpotlightCard>
          </li>
        ))}
      </ol>
    </Section>
  );
}
