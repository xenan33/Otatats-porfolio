// Red paper lanterns hanging from the top of the hero, swaying gently.
const LANTERNS = [
  { right: '6%', drop: 30, size: 46, delay: '0s' },
  { right: '15%', drop: 70, size: 36, delay: '1.2s' },
  { right: '24%', drop: 18, size: 30, delay: '0.6s' },
];

export default function Lanterns() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden h-56 sm:block">
      {LANTERNS.map((l, i) => (
        <div
          key={i}
          className="absolute top-0 origin-top motion-reduce:[animation:none]"
          style={{ right: l.right, animation: `sway 4s ease-in-out ${l.delay} infinite alternate` }}
        >
          <div className="mx-auto w-px bg-amber-300/60" style={{ height: l.drop }} />
          <svg viewBox="0 0 40 52" width={l.size} height={l.size * 1.3} className="drop-shadow-[0_0_14px_rgba(248,113,113,0.55)]">
            <rect x="13" y="0" width="14" height="5" rx="1" fill="#eab308" />
            <ellipse cx="20" cy="24" rx="18" ry="17" fill="#dc2626" />
            <path d="M20 7v34M11 9c-4 9-4 21 0 30M29 9c4 9 4 21 0 30" stroke="#991b1b" strokeWidth="1.4" fill="none" />
            <rect x="13" y="39" width="14" height="5" rx="1" fill="#eab308" />
            <path d="M17 44v7M20 44v8M23 44v7" stroke="#eab308" strokeWidth="1.4" />
          </svg>
        </div>
      ))}
    </div>
  );
}
