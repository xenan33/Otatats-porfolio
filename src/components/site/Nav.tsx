import Link from 'next/link';
import { Logo } from './ui';

const LINKS = [
  ['About', '#about'],
  ['Expertise', '#expertise'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
] as const;

export default function Nav({ name, resumeUrl }: { name: string; resumeUrl: string | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-navy">
          <Logo className="h-8 w-8" />
          <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">{name}</span>
        </Link>
        <ul className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="transition-colors hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              Résumé
            </a>
          )}
          <a href="#contact" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent">
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
