// Hearts rising slowly up the whole page (CSS animation, hidden for reduced motion).
const HEARTS = [
  { left: '6%', size: 18, delay: '0s', dur: '11s', color: '#f472b6' },
  { left: '22%', size: 12, delay: '4s', dur: '13s', color: '#fb7185' },
  { left: '41%', size: 22, delay: '7s', dur: '12s', color: '#ec4899' },
  { left: '58%', size: 14, delay: '2s', dur: '14s', color: '#f9a8d4' },
  { left: '74%', size: 20, delay: '9s', dur: '12s', color: '#f472b6' },
  { left: '90%', size: 13, delay: '5s', dur: '10s', color: '#fb7185' },
];

export default function Hearts() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden motion-reduce:hidden">
      {HEARTS.map((h, i) => (
        <svg
          key={i}
          viewBox="0 0 24 22"
          width={h.size}
          height={h.size}
          className="absolute -bottom-8 opacity-0"
          style={{ left: h.left, fill: h.color, animation: `heart-rise ${h.dur} ease-in ${h.delay} infinite` }}
        >
          <path d="M12 21.6 10.3 20C4.2 14.5.2 10.9.2 6.5.2 2.9 3 .1 6.6.1c2 0 4 .9 5.4 2.4C13.4 1 15.4.1 17.4.1 21 .1 23.8 2.9 23.8 6.5c0 4.4-4 8-10.1 13.5z" />
        </svg>
      ))}
    </div>
  );
}
