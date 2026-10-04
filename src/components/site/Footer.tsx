import { Logo } from './ui';

export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-6">
        <p className="flex items-center gap-2.5">
          <Logo className="h-6 w-6 text-ink" />© {new Date().getFullYear()} {name}
        </p>
        <p className="flex gap-5">
          <a href="https://codex.otatats.top" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            The Inner Mirror
          </a>
          <a href="/.well-known/security.txt" className="hover:text-ink">
            security.txt
          </a>
        </p>
      </div>
    </footer>
  );
}
