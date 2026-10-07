import type { PortfolioData } from '@/lib/types';
import ContactForm from './ContactForm';

export default function Contact({ data, phone }: { data: PortfolioData; phone: string | null }) {
  const { profile, settings } = data;
  const links = [
    settings.show_email && profile?.email ? { label: 'Email', value: profile.email, href: `mailto:${profile.email}` } : null,
    phone ? { label: 'Phone', value: phone, href: `tel:${phone.replace(/\s/g, '')}` } : null,
    profile?.linkedin_url
      ? { label: 'LinkedIn', value: profile.linkedin_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), href: profile.linkedin_url }
      : null,
    profile?.github_url ? { label: 'GitHub', value: profile.github_url.replace(/^https?:\/\/(www\.)?/, ''), href: profile.github_url } : null,
  ].filter((l): l is { label: string; value: string; href: string } => l !== null);

  return (
    <section id="contact" className="scroll-mt-20 px-4 pb-20 sm:px-6 lg:pb-24">
      <div className="mx-auto grid max-w-6xl gap-10 overflow-hidden rounded-3xl bg-navy p-8 text-white dark:ring-1 dark:ring-navy-line sm:p-12 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Let&apos;s talk</h2>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-white/75">
            {profile?.availability === 'projects'
              ? 'Need help with security, infrastructure, IT operations or a new website? Send a message and I’ll get back to you.'
              : 'Hiring for security, infrastructure or IT operations, or need a website built? Send a message and I’ll get back to you.'}
          </p>
          <dl className="mt-8 space-y-4">
            {links.map((l) => (
              <div key={l.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">{l.label}</dt>
                <dd className="mt-1" data-allow-copy>
                  <a
                    href={l.href}
                    {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="break-all text-[15px] font-medium text-white underline decoration-white/25 underline-offset-4 hover:decoration-sky"
                  >
                    {l.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {settings.show_contact_form && (
          <div className="relative rounded-2xl bg-card p-6 text-ink sm:p-8">
            <ContactForm />
          </div>
        )}
      </div>
    </section>
  );
}
