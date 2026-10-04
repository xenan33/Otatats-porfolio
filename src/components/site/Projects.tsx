import Link from 'next/link';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import type { Project } from '@/lib/types';
import { Section, Tag, rgba } from './ui';

export default function Projects({ projects, accent }: { projects: Project[]; accent: string }) {
  if (!projects.length) return null;
  return (
    <Section id="projects" eyebrow="Projects" title="Things I've built">
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <SpotlightCard
            key={p.id}
            spotlightColor={rgba(accent, 0.1)}
            className={`tile !rounded-2xl !p-7 sm:!p-8 ${p.featured ? 'md:col-span-2' : ''}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {p.featured && <Tag>Featured</Tag>}
              {!p.live_url && <Tag>Internal tool</Tag>}
              {p.live_url && <span className="font-mono text-xs text-muted">{new URL(p.live_url).host}</span>}
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{p.title}</h3>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink/80">{p.description}</p>
            {p.technologies.length > 0 && (
              <p className="mt-4 text-sm text-muted">{p.technologies.join(' · ')}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {p.live_url && (
                <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent">
                  Visit site ↗
                </a>
              )}
              {p.long_description && (
                <Link href={`/projects/${p.slug}`} className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent">
                  Read more
                </Link>
              )}
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent">
                  Source ↗
                </a>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
