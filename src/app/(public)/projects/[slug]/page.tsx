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
    <main className="dot-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/#projects" className="font-mono text-sm text-muted hover:text-ink">
          ← cd ..
        </Link>
        <p className="mt-10 font-mono text-xs uppercase tracking-wider text-accent">
          {project.live_url ? 'Project' : 'Internal tool'}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{project.title}</h1>
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
        <div className="mt-10 rounded-2xl border border-line bg-surface/90 p-6">
          <Bullets text={project.long_description} />
        </div>
        <div className="mt-8 flex gap-6 font-mono text-sm">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              visit site ↗
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
              source ↗
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
