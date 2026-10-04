import Image from 'next/image';
import CountUp from '@/components/reactbits/CountUp';
import type { PortfolioData } from '@/lib/types';
import { Section } from './ui';

export default function About({ data }: { data: PortfolioData }) {
  const { profile, experience, certifications, skills } = data;
  if (!profile) return null;
  const earliest = experience.reduce<string | null>((min, e) => (!min || e.start_date < min ? e.start_date : min), null);
  const years = earliest ? yearsSince(earliest) : 0;

  const stats = [
    { value: years, suffix: '+', label: 'years in IT' },
    { value: experience.length, suffix: '', label: 'roles' },
    { value: certifications.length, suffix: '', label: 'certifications' },
    { value: skills.length, suffix: '', label: 'core skills' },
  ];

  return (
    <Section id="about" label="cat about.md" title="About">
      <div className="grid gap-10 lg:grid-cols-[auto_1fr]">
        {profile.profile_image_url && (
          <Image
            src={profile.profile_image_url}
            alt={profile.name}
            width={220}
            height={220}
            className="h-[220px] w-[220px] rounded-2xl border border-line object-cover"
          />
        )}
        <div>
          <p className="max-w-3xl text-lg leading-relaxed text-ink/85">{profile.bio}</p>
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-surface/80 p-5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-3xl font-semibold text-accent">
                  <CountUp to={s.value} duration={1.5} />
                  {s.suffix}
                </dd>
                <p className="mt-1 text-sm text-muted" aria-hidden="true">
                  {s.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

function yearsSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / (365.25 * 86_400_000));
}
