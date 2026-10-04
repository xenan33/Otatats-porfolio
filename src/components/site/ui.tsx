import type { ReactNode } from 'react';

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {intro && <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p>}
      </div>
      <div className="mt-12">{children}</div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-accent-2">{children}</span>;
}

// Renders "- item" lines as a list and other lines as paragraphs.
export function Bullets({ text }: { text: string | null }) {
  if (!text) return null;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <div className="space-y-2 text-[15px] leading-relaxed text-ink/80">
      {lines.map((line, i) =>
        line.startsWith('- ') ? (
          <p key={i} className="flex gap-3">
            <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
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

export function yearsSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / (365.25 * 86_400_000));
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path d="M22 12 V40 a10 10 0 0 1 -10 10 h-4" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <circle cx="40" cy="38" r="14" fill="none" stroke="var(--accent)" strokeWidth="7" />
    </svg>
  );
}
