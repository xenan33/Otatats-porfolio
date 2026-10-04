import BlurText from '@/components/reactbits/BlurText';
import CountUp from '@/components/reactbits/CountUp';
import type { PortfolioData } from '@/lib/types';
import { SEASON_THEME, type Season } from '@/lib/season';
import HeroBackdrop from './HeroBackdrop';
import HeroSeasonal from './seasonal/HeroSeasonal';
import { yearsSince } from './ui';

// Same focus areas as the email signature.
const FOCUS = ['Microsoft 365', 'Infrastructure', 'Cybersecurity', 'Automation & Development'];

// Badge text and the line beside it, per availability setting (admin → Profile).
const AVAILABILITY: Record<string, { badge: string; note: (role: string | null) => string | null } | null> = {
  open: { badge: 'Open to work', note: (role) => (role ? `Seeking ${role}` : null) },
  projects: { badge: 'Open to projects', note: () => 'Taking on freelance and side projects' },
  offers: { badge: 'Open to offers', note: (role) => (role ? `Interested in ${role}` : null) },
  closed: null,
};

export default function Hero({ data, animated, season }: { data: PortfolioData; animated: boolean; season: Season | null }) {
  const { profile, experience, certifications } = data;
  if (!profile) return null;
  const availability = AVAILABILITY[profile.availability];
  const note = availability?.note(profile.target_role);
  const current = experience.find((e) => e.current) ?? experience[0];
  const earliest = experience.reduce<string | null>((min, e) => (!min || e.start_date < min ? e.start_date : min), null);
  const years = profile.years_experience ?? (earliest ? yearsSince(earliest) : 0);

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <HeroBackdrop animated={animated} colors={season ? SEASON_THEME[season].aurora : undefined} />
      {season && <HeroSeasonal season={season} />}
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:pb-28 lg:pt-24">
        <div>
          {availability && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 font-semibold text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {availability.badge}
              </span>
              {note && <span className="text-white/80">{note}</span>}
              {season && (
                <span className="rounded-full border border-white/20 px-3 py-1 font-semibold text-white">{SEASON_THEME[season].greeting}</span>
              )}
            </div>
          )}
          <h1 className="mt-7 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <BlurText text={profile.name} animateBy="words" delay={120} direction="bottom" />
          </h1>
          {profile.headline && <p className="mt-5 font-display text-xl font-medium text-sky sm:text-2xl">{profile.headline}</p>}
          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[15px] text-white/70">
            {FOCUS.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#experience" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy">
              View experience
            </a>
            <a href="#contact" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
              Get in touch
            </a>
          </div>
        </div>

        <aside aria-label="Snapshot" className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-7">
          {current && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky">{current.current ? 'Currently' : 'Most recently'}</p>
              <p className="mt-2 font-display text-lg font-semibold leading-snug">{current.title}</p>
              <p className="text-sm text-white/65">{current.company}</p>
            </div>
          )}
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10">
            <div className="flex flex-col-reverse bg-navy-2/80 p-4">
              <dt className="mt-1 text-sm text-white/65">years in IT</dt>
              <dd className="font-display text-3xl font-semibold tabular-nums">
                <CountUp to={years} duration={1.4} />+
              </dd>
            </div>
            <div className="flex flex-col-reverse bg-navy-2/80 p-4">
              <dt className="mt-1 text-sm text-white/65">certifications</dt>
              <dd className="font-display text-3xl font-semibold tabular-nums">
                <CountUp to={certifications.length} duration={1.4} />
              </dd>
            </div>
          </dl>
          {profile.location && (
            <p className="mt-6 flex items-start gap-2 text-sm text-white/75">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 fill-sky">
                <path d="M10 1.5a6.5 6.5 0 0 0-6.5 6.5c0 4.6 6.5 10.5 6.5 10.5s6.5-5.9 6.5-10.5A6.5 6.5 0 0 0 10 1.5Zm0 9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
              </svg>
              {profile.location}
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
