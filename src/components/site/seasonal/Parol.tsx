// A Filipino parol (Christmas star lantern) hanging in the hero.
export default function Parol({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 hidden origin-top sm:block motion-reduce:[animation:none] ${className}`}
      style={{ animation: 'sway 5s ease-in-out infinite alternate' }}
    >
      <div className="mx-auto h-10 w-px bg-amber-200/60" />
      <svg viewBox="0 0 100 130" width="92" height="120" className="drop-shadow-[0_0_18px_rgba(250,204,21,0.55)]">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#facc15" strokeWidth="3" />
        <path d="M50 10 61 38 91 39 67 57 76 86 50 69 24 86 33 57 9 39 39 38Z" fill="#dc2626" stroke="#facc15" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="50" cy="52" r="9" fill="#facc15" />
        <path d="M38 94c-2 12-6 22-10 30M50 94v34M62 94c2 12 6 22 10 30" stroke="#facc15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M44 94c-1 10-3 18-5 26M56 94c1 10 3 18 5 26" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
