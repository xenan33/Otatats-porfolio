// The eight-rayed sun and three stars of the Philippine flag, faint behind the hero.
export default function PhSun() {
  const rays = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 opacity-[0.16] lg:block">
      <svg viewBox="-100 -100 200 200" width="520" height="520" className="motion-safe:animate-[spin_90s_linear_infinite]">
        <circle r="34" fill="#fcd116" />
        {rays.map((a) => (
          <g key={a} transform={`rotate(${a})`} fill="#fcd116">
            <path d="M0 -40 7 -88 0 -80 -7 -88Z" />
            <path d="M-12 -42 -16 -78 -6 -44Z" />
            <path d="M12 -42 16 -78 6 -44Z" />
          </g>
        ))}
      </svg>
    </div>
  );
}
