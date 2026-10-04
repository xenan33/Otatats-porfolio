import type { ReactNode } from 'react';

export function Section({ id, label, title, children }: { id: string; label: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
      <p className="font-mono text-sm text-accent">
        <span className="text-muted">$</span> {label}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-xs text-muted">{children}</span>
  );
}

// Renders "- item" lines as a terminal-style list and other lines as paragraphs.
export function Bullets({ text }: { text: string | null }) {
  if (!text) return null;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-ink/85">
      {lines.map((line, i) =>
        line.startsWith('- ') ? (
          <p key={i} className="flex gap-2">
            <span className="select-none font-mono text-accent">&gt;</span>
            <span>{line.slice(2)}</span>
          </p>
        ) : (
          <p key={i}>{line}</p>
        ),
      )}
    </div>
  );
}

export function formatMonth(date: string | null) {
  if (!date) return '';
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function rgba(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})` as `rgba(${number}, ${number}, ${number}, ${number})`;
}
