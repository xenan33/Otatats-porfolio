import type { PortfolioData } from '@/lib/types';
import About from './About';
import Background from './Background';
import Contact from './Contact';
import Credentials from './Credentials';
import CursorEffect from './CursorEffect';
import Experience from './Experience';
import Footer from './Footer';
import Hero from './Hero';
import Nav from './Nav';
import Projects from './Projects';
import Skills from './Skills';

// The full one-page portfolio. `phone` is only passed when settings or a
// recruiter share link allow it.
export default function Portfolio({ data, phone }: { data: PortfolioData; phone: string | null }) {
  const { profile, settings } = data;
  const accent = settings.accent;

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center p-6 font-mono text-sm text-muted">
        <p>[ .. ] Portfolio content is not published yet.</p>
      </main>
    );
  }

  return (
    <div style={{ '--accent': accent } as React.CSSProperties}>
      <Background effect={settings.background_effect} accent={accent} />
      <CursorEffect color={accent} />
      <Nav resumeUrl={profile.resume_url} />
      <main>
        <Hero profile={profile} accent={accent} />
        <About data={data} />
        <Skills skills={data.skills} accent={accent} />
        <Experience roles={data.experience} accent={accent} />
        <Credentials certifications={data.certifications} education={data.education} />
        <Projects projects={data.projects} accent={accent} />
        <Contact data={data} phone={phone} />
      </main>
      <Footer name={profile.name} />
    </div>
  );
}
