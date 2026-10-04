export type Season =
  | 'newyear'
  | 'sinulog'
  | 'lunarnewyear'
  | 'valentines'
  | 'kagitingan'
  | 'independence'
  | 'sysadmin'
  | 'heroes'
  | 'bermonths'
  | 'halloween'
  | 'bonifacio'
  | 'christmas';

export const SEASONS: Season[] = [
  'newyear',
  'sinulog',
  'lunarnewyear',
  'valentines',
  'kagitingan',
  'independence',
  'sysadmin',
  'heroes',
  'bermonths',
  'halloween',
  'bonifacio',
  'christmas',
];

// Chinese New Year falls on a different day each year, so it is listed (month is 1-based).
const LUNAR_NEW_YEAR: Record<number, [number, number]> = {
  2026: [2, 17],
  2027: [2, 6],
  2028: [1, 26],
  2029: [2, 13],
  2030: [2, 3],
  2031: [1, 23],
  2032: [2, 11],
  2033: [1, 31],
  2034: [2, 19],
  2035: [2, 8],
  2036: [1, 28],
};

const DAY = 86_400_000;

// Today's calendar date in the owner's time zone, as a UTC-midnight timestamp.
function localDate(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day'), t: Date.UTC(get('year'), get('month') - 1, get('day')) };
}

// The nth (1-based) or last (n = -1) given weekday (0 = Sunday) of a month.
function weekdayOf(year: number, month: number, weekday: number, n: number) {
  if (n > 0) {
    const first = Date.UTC(year, month - 1, 1);
    const offset = (weekday - new Date(first).getUTCDay() + 7) % 7;
    return first + (offset + (n - 1) * 7) * DAY;
  }
  const last = Date.UTC(year, month, 0);
  return last - ((new Date(last).getUTCDay() - weekday + 7) % 7) * DAY;
}

// Seasons follow the owner's local date (Philippines), not the visitor's or the server's.
// When two overlap, the earlier rule wins.
export function seasonFor(now: Date, timeZone = 'Asia/Manila'): Season | null {
  const { year, month, day, t } = localDate(now, timeZone);
  const on = (m: number, d: number) => month === m && day === d;
  const within = (start: number, end: number) => t >= start && t <= end;

  // New Year: 31 December to 7 January.
  if (on(12, 31) || (month === 1 && day <= 7)) return 'newyear';
  // Chinese New Year: the eve to two days after.
  const lny = LUNAR_NEW_YEAR[year];
  if (lny) {
    const start = Date.UTC(year, lny[0] - 1, lny[1]);
    if (within(start - DAY, start + 2 * DAY)) return 'lunarnewyear';
  }
  // Sinulog (Cebu): the nine days ending on the third Sunday of January.
  const sinulog = weekdayOf(year, 1, 0, 3);
  if (within(sinulog - 8 * DAY, sinulog)) return 'sinulog';
  // Valentine's week: 10 to 14 February.
  if (month === 2 && day >= 10 && day <= 14) return 'valentines';
  // Araw ng Kagitingan: 9 April.
  if (on(4, 9)) return 'kagitingan';
  // Independence Day: 10 to 12 June.
  if (month === 6 && day >= 10 && day <= 12) return 'independence';
  // System Administrator Appreciation Day: last Friday of July.
  if (t === weekdayOf(year, 7, 5, -1)) return 'sysadmin';
  // National Heroes Day: last Monday of August.
  if (t === weekdayOf(year, 8, 1, -1)) return 'heroes';
  // The "ber" months start the Filipino Christmas countdown; September gets its own look.
  if (month === 9) return 'bermonths';
  if (month === 10) return 'halloween';
  // Bonifacio Day: 30 November.
  if (on(11, 30)) return 'bonifacio';
  if (month === 12) return 'christmas';
  return null;
}

// Days left until the next 25 December (owner's time zone).
function daysToChristmas(now: Date, timeZone: string) {
  const { year, t } = localDate(now, timeZone);
  const xmas = Date.UTC(year, 11, 25);
  return Math.round(((t <= xmas ? xmas : Date.UTC(year + 1, 11, 25)) - t) / DAY);
}

export function seasonGreeting(season: Season, now = new Date(), timeZone = 'Asia/Manila') {
  if (season === 'bermonths') {
    const days = daysToChristmas(now, timeZone);
    return days === 0 ? 'Maligayang Pasko' : `${days} day${days === 1 ? '' : 's'} to Christmas`;
  }
  return SEASON_THEME[season].greeting;
}

type Theme = { accent: string; aurora: [string, string, string]; greeting: string };

// Philippine flag colours, shared by the national days.
const FLAG: [string, string, string] = ['#0038a8', '#ce1126', '#fcd116'];

// Per-season look: accent (AA on white), hero glow colours, and greeting.
export const SEASON_THEME: Record<Season, Theme> = {
  newyear: { accent: '#a16207', aurora: ['#0b3b7a', '#eab308', '#7c3aed'], greeting: 'Happy New Year' },
  sinulog: { accent: '#b45309', aurora: ['#b91c1c', '#f59e0b', '#7c3aed'], greeting: 'Pit Señor! Happy Sinulog' },
  lunarnewyear: { accent: '#b91c1c', aurora: ['#7f1d1d', '#dc2626', '#eab308'], greeting: 'Kung Hei Fat Choi' },
  valentines: { accent: '#be185d', aurora: ['#831843', '#ec4899', '#7c3aed'], greeting: "Happy Valentine's Day" },
  kagitingan: { accent: '#0038a8', aurora: FLAG, greeting: 'Araw ng Kagitingan' },
  independence: { accent: '#0038a8', aurora: FLAG, greeting: 'Maligayang Araw ng Kalayaan' },
  sysadmin: { accent: '#0a68e6', aurora: ['#0b3b7a', '#0a68e6', '#10b981'], greeting: 'Happy SysAdmin Day' },
  heroes: { accent: '#0038a8', aurora: FLAG, greeting: 'Happy National Heroes Day' },
  bermonths: { accent: '#15803d', aurora: ['#065f46', '#0a68e6', '#15803d'], greeting: 'Christmas countdown' },
  halloween: { accent: '#c2410c', aurora: ['#4c1d95', '#ea580c', '#7c3aed'], greeting: 'Happy Halloween' },
  bonifacio: { accent: '#0038a8', aurora: FLAG, greeting: 'Bonifacio Day' },
  christmas: { accent: '#b91c1c', aurora: ['#065f46', '#0a68e6', '#b91c1c'], greeting: 'Maligayang Pasko' },
};
