export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 font-mono text-xs text-muted sm:px-6">
        <p>
          © {new Date().getFullYear()} {name} · built with Next.js &amp; React Bits
        </p>
        <p className="flex gap-4">
          <a href="https://codex.otatats.top" target="_blank" rel="noopener noreferrer" className="cursor-target hover:text-ink">
            codex.otatats.top
          </a>
          <a href="/.well-known/security.txt" className="cursor-target hover:text-ink">
            security.txt
          </a>
        </p>
      </div>
    </footer>
  );
}
