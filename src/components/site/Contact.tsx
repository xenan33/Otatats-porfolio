import type { PortfolioData } from '@/lib/types';
import ContactForm from './ContactForm';
import { Section } from './ui';

export default function Contact({ data, phone }: { data: PortfolioData; phone: string | null }) {
  const { profile, settings } = data;
  return (
    <Section id="contact" label="ssh contact@otatats" title="Get in touch">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <p className="text-ink/85">
            Hiring for security, infrastructure or IT operations? I&apos;d like to hear about it.
          </p>
          <ul className="space-y-3 font-mono text-sm">
            {settings.show_email && profile?.email && (
              <li>
                <span className="text-muted">email </span>
                <a href={`mailto:${profile.email}`} className="cursor-target text-accent hover:underline">
                  {profile.email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <span className="text-muted">phone </span>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="cursor-target text-accent hover:underline">
                  {phone}
                </a>
              </li>
            )}
            {profile?.linkedin_url && (
              <li>
                <span className="text-muted">linkedin </span>
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="cursor-target text-accent hover:underline">
                  {profile.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </li>
            )}
            {profile?.github_url && (
              <li>
                <span className="text-muted">github </span>
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="cursor-target text-accent hover:underline">
                  {profile.github_url.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </li>
            )}
          </ul>
        </div>
        {settings.show_contact_form && (
          <div className="relative rounded-2xl border border-line bg-surface/90 p-6">
            <ContactForm />
          </div>
        )}
      </div>
    </Section>
  );
}
