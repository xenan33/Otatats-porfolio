import Link from 'next/link';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import type { Project } from '@/lib/types';
import { Section, Tag, rgba } from './ui';

export default function Projects({ projects, accent }: { projects: Project[]; accent: string }) {
  if (!projects.length) return null;
  return (
    <Section id="projects" label="ls ./projects" title="Projects">
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <SpotlightCard
            key={p.id}
            spotlightColor={rgba(accent, 0.15)}
            className={`!rounded-2xl !border-line !bg-surface/90 !p-6 ${p.featured ? 'md:col-span-2' : ''}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              {p.featured && <span className="font-mono text-[11px] uppercase tracking-wider text-accent">★ Featured</span>}
              {!p.live_url && <span className="font-mono text-[11px] uppercase tracking-wider text-accent-2">Internal tool</span>}
            </div>
            <h3 className="mt-2 text-xl font-semibold">{p.title}</h3>
            {p.live_url && <p className="font-mono text-xs text-muted">{new URL(p.live_url).host}</p>}
            <p className="mt-3 max-w-3xl text-ink/85">{p.description}</p>
            {p.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.technologies.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-4 font-mono text-sm">
              {p.live_url && (
                <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="cursor-target text-accent hover:underline">
                  visit site ↗
                </a>
              )}
              {p.long_description && (
                <Link href={`/projects/${p.slug}`} className="cursor-target text-muted hover:text-ink">
                  details →
                </Link>
              )}
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="cursor-target text-muted hover:text-ink">
                  source ↗
                </a>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
