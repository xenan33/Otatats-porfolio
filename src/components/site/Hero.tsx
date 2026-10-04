import DecryptedText from '@/components/reactbits/DecryptedText';
import ShinyText from '@/components/reactbits/ShinyText';
import StarBorder from '@/components/reactbits/StarBorder';
import TextType from '@/components/reactbits/TextType';
import type { Profile } from '@/lib/types';

const AVAILABILITY: Record<Profile['availability'], string | null> = {
  open: 'Open to work',
  offers: 'Open to offers',
  closed: null,
};

// Mirrors the tagline in the owner's email signature.
const ROTATING = ['Microsoft 365', 'Infrastructure', 'Cybersecurity', 'Automation & Development'];

export default function Hero({ profile, accent }: { profile: Profile; accent: string }) {
  const availability = AVAILABILITY[profile.availability];
  return (
    <section className="mx-auto grid min-h-[86vh] w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
      <div>
        {availability && (
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            <ShinyText text={`${availability}${profile.target_role ? ` · ${profile.target_role}` : ''}`} color="#0b3b7a" shineColor="#7fb4ff" speed={3} />
          </p>
        )}
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          <DecryptedText
            text={profile.name}
            animateOn="view"
            sequential
            speed={40}
            revealDirection="start"
            characters="01ABCDEF#$%&*<>/"
            className="text-ink"
            encryptedClassName="text-accent"
          />
        </h1>
        {profile.headline && <p className="mt-4 text-lg text-muted sm:text-xl">{profile.headline}</p>}
        <div className="mt-4 h-8 font-mono text-base text-accent sm:text-lg">
          <TextType text={ROTATING} typingSpeed={45} deletingSpeed={25} pauseDuration={1800} cursorCharacter="▋" as="span" />
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <StarBorder as="a" href="#experience" color={accent} speed="5s" backgroundColor="#071a33" borderColor="#1c3150" textColor="#ffffff" className="cursor-target">
            <span className="font-mono text-sm">./view_experience</span>
          </StarBorder>
          <a
            href="#contact"
            className="cursor-target inline-flex items-center rounded-[20px] border border-line px-6 py-4 font-mono text-sm text-muted transition-colors hover:border-accent/60 hover:text-ink"
          >
            ./contact
          </a>
        </div>
      </div>
      <Terminal profile={profile} />
    </section>
  );
}

function Terminal({ profile }: { profile: Profile }) {
  return (
    <div className="overflow-hidden rounded-xl border border-navy-line bg-navy text-white shadow-2xl shadow-navy/25">
      <div className="flex items-center gap-2 border-b border-navy-line px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-danger/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 font-mono text-xs text-white/55">jamo@otatats: ~</span>
      </div>
      <div className="space-y-3 p-5 font-mono text-[13px] leading-relaxed">
        <p>
          <span className="text-[#7fb4ff]">$</span> whoami
        </p>
        <p className="text-white/90">{profile.name}</p>
        <p>
          <span className="text-[#7fb4ff]">$</span> cat role.txt
        </p>
        <p className="text-white/90">{profile.headline}</p>
        {profile.location && (
          <>
            <p>
              <span className="text-[#7fb4ff]">$</span> locate
            </p>
            <p className="text-white/90">{profile.location}</p>
          </>
        )}
        <p>
          <span className="text-[#7fb4ff]">$</span> systemctl status security
        </p>
        <p className="text-[#7fb4ff]">
          [ OK ] <span className="text-white/90">monitoring · incident response · hardening</span>
        </p>
      </div>
    </div>
  );
}
