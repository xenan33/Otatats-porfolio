// Three gold stars, as on the Philippine flag, shown with the sun.
const STAR = 'M0 -10 2.9 -4 9.5 -3.1 4.7 1.5 5.9 8.1 0 5 -5.9 8.1 -4.7 1.5 -9.5 -3.1 -2.9 -4Z';

export default function PhStars() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 30" width="96" height="24" className="pointer-events-none absolute bottom-6 right-6 hidden fill-[#fcd116] opacity-70 sm:block">
      <path d={STAR} transform="translate(15 15)" />
      <path d={STAR} transform="translate(60 15)" />
      <path d={STAR} transform="translate(105 15)" />
    </svg>
  );
}
