export type Season = 'halloween' | 'christmas' | 'newyear';

export const SEASONS: Season[] = ['halloween', 'christmas', 'newyear'];

// Seasons follow the owner's local date (Philippines), not the visitor's or the server's.
//   halloween  1–31 October
//   christmas  1–30 December
//   newyear    31 December – 7 January
export function seasonFor(now: Date, timeZone = 'Asia/Manila'): Season | null {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, month: 'numeric', day: 'numeric' }).formatToParts(now);
  const month = Number(parts.find((p) => p.type === 'month')?.value);
  const day = Number(parts.find((p) => p.type === 'day')?.value);
  if (month === 10) return 'halloween';
  if (month === 12) return day === 31 ? 'newyear' : 'christmas';
  if (month === 1 && day <= 7) return 'newyear';
  return null;
}

// Per-season look: accent (AA on white), hero glow colours and a greeting.
export const SEASON_THEME: Record<Season, { accent: string; aurora: [string, string, string]; greeting: string }> = {
  halloween: { accent: '#c2410c', aurora: ['#4c1d95', '#ea580c', '#7c3aed'], greeting: 'Happy Halloween' },
  christmas: { accent: '#b91c1c', aurora: ['#065f46', '#0a68e6', '#b91c1c'], greeting: 'Merry Christmas' },
  newyear: { accent: '#a16207', aurora: ['#0b3b7a', '#eab308', '#7c3aed'], greeting: 'Happy New Year' },
};
