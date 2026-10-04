// A few bats drifting across the page at Halloween (CSS animation, off for reduced motion).
const BATS = [
  { top: '14%', delay: '0s', dur: '16s', size: 26 },
  { top: '30%', delay: '5s', dur: '20s', size: 18 },
  { top: '8%', delay: '10s', dur: '18s', size: 22 },
];

export default function Bats() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden motion-reduce:hidden">
      {BATS.map((b, i) => (
        <svg
          key={i}
          viewBox="0 0 40 20"
          width={b.size * 2}
          height={b.size}
          className="absolute -left-16 fill-black/70"
          style={{ top: b.top, animation: `bat-fly ${b.dur} linear ${b.delay} infinite` }}
        >
          <path d="M20 8c1-2 2-3 3-3l1 2c3-4 9-5 16-3-4 1-6 4-6 7-2-2-4-2-6 0-1-2-3-2-4 0-1-1-2-2-4-2s-3 1-4 2c-1-2-3-2-4 0-2-2-4-2-6 0 0-3-2-6-6-7 7-2 13-1 16 3l1-2c1 0 2 1 3 3z" />
        </svg>
      ))}
    </div>
  );
}
