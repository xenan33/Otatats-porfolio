import Image from 'next/image';
import type { Profile } from '@/lib/types';
import { Section } from './ui';

export default function About({ profile }: { profile: Profile }) {
  if (!profile.bio) return null;
  const looking =
    profile.availability === 'projects'
      ? { label: 'Available for', value: 'Freelance and side projects' }
      : profile.availability !== 'closed' && profile.target_role
        ? { label: 'Looking for', value: profile.target_role }
        : null;
  return (
    <Section id="about" eyebrow="About" title="Keeping businesses running, and keeping them secure">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          {profile.profile_image_url && (
            <Image
              src={profile.profile_image_url}
              alt={profile.name}
              width={160}
              height={160}
              className="h-40 w-40 shrink-0 rounded-2xl object-cover"
            />
          )}
          <p className="max-w-[62ch] text-lg leading-relaxed text-ink/85">{profile.bio}</p>
        </div>
        {looking && (
          <div className="self-start rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{looking.label}</p>
            <p className="mt-3 font-display text-xl font-semibold leading-snug text-ink">{looking.value}</p>
            <a href="#contact" className="mt-5 inline-flex text-sm font-semibold text-accent hover:text-accent-2">
              Start a conversation →
            </a>
          </div>
        )}
      </div>
    </Section>
  );
}
