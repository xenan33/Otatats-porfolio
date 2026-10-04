import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bullets, Tag } from '@/components/site/ui';
import { getProject } from '@/lib/data';

export async function generateMetadata({ params }: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return project ? { title: project.title, description: project.description ?? undefined } : {};
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
  const project = await getProject((await params).slug);
  if (!project) notFound();

  return (
    <main data-theme-auto className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/#projects" className="text-sm font-medium text-muted hover:text-ink">
          ← Back to portfolio
        </Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-accent-text">
          {project.live_url ? 'Project' : 'Internal tool'}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-4 text-lg text-ink/85">{project.description}</p>
        {project.technologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
        {project.image_url && (
          <Image src={project.image_url} alt={`${project.title} screenshot`} width={1200} height={750} className="mt-10 rounded-xl border border-line" />
        )}
        <div className="mt-10 rounded-2xl border border-line bg-card p-6 sm:p-8">
          <Bullets text={project.long_description} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent dark:bg-accent dark:hover:bg-accent-2 dark:hover:text-navy">
              Visit site ↗
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent-text">
              Source ↗
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
