import { SEASON_THEME, type Season } from '@/lib/season';
import type { PortfolioData } from '@/lib/types';
import About from './About';
import Contact from './Contact';
import Credentials from './Credentials';
import Experience from './Experience';
import Footer from './Footer';
import Hero from './Hero';
import Nav from './Nav';
import Projects from './Projects';
import Skills from './Skills';
import SeasonalEffects from './seasonal/SeasonalEffects';

// The full one-page portfolio. `phone` is only passed when settings or a
// recruiter share link allow it.
export default function Portfolio({ data, phone, season = null }: { data: PortfolioData; phone: string | null; season?: Season | null }) {
  const { profile, settings } = data;
  const accent = season ? SEASON_THEME[season].accent : settings.accent;

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center p-6 text-sm text-muted">
        <p>The portfolio isn&apos;t published yet.</p>
      </main>
    );
  }

  return (
    <div style={{ '--accent': accent, '--glow': season ? SEASON_THEME[season].aurora[1] : accent } as React.CSSProperties}>
      {season && <SeasonalEffects season={season} />}
      <Nav name={profile.name} resumeUrl={profile.resume_url} />
      <main>
        <Hero data={data} animated={settings.background_effect !== 'none'} season={season} />
        <About profile={profile} />
        <Skills skills={data.skills} accent={accent} />
        <Experience roles={data.experience} />
        <Credentials certifications={data.certifications} education={data.education} />
        <Projects projects={data.projects} accent={accent} />
        <Contact data={data} phone={phone} />
      </main>
      <Footer name={profile.name} />
    </div>
  );
}
