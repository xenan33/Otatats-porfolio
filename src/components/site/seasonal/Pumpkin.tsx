export default function Pumpkin({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 60" aria-hidden="true" className={className}>
      <path d="M33 10c0-5 2-8 6-9l1 3c-3 1-4 3-4 6z" fill="#3f6212" />
      <ellipse cx="18" cy="35" rx="14" ry="20" fill="#ea580c" />
      <ellipse cx="46" cy="35" rx="14" ry="20" fill="#ea580c" />
      <ellipse cx="32" cy="35" rx="15" ry="22" fill="#f97316" />
      <path d="M20 30l6-5 2 7zM44 30l-6-5-2 7z" fill="#431407" />
      <path d="M19 41c4 6 22 6 26 0l-4 2-3-3-3 3-3-3-3 3-3-3-3 3z" fill="#431407" />
    </svg>
  );
}
