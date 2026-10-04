import Link from 'next/link';

const LINKS = [
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Contact', '#contact'],
] as const;

export default function Nav({ resumeUrl }: { resumeUrl: string | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="John Anthony Otayco, home" className="cursor-target flex items-baseline gap-2">
          <span className="text-xl font-extrabold tracking-tighter text-navy">
            J<span className="text-accent">O</span>
          </span>
          <span className="font-mono text-xs text-muted">otatats.top</span>
        </Link>
        <ul className="hidden items-center gap-6 text-sm text-muted md:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="cursor-target transition-colors hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target rounded-md border border-accent/50 px-3 py-1.5 font-mono text-xs text-accent hover:bg-accent/10"
          >
            resume.pdf
          </a>
        ) : (
          <a href="#contact" className="cursor-target rounded-md border border-accent/50 px-3 py-1.5 font-mono text-xs text-accent hover:bg-accent/10 md:hidden">
            contact
          </a>
        )}
      </nav>
    </header>
  );
}
