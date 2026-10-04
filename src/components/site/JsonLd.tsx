import { headers } from 'next/headers';
import { SITE_URL } from '@/lib/env';
import type { PortfolioData } from '@/lib/types';

// schema.org Person data for search engines. Uses the CSP nonce from the proxy.
export default async function JsonLd({ data }: { data: PortfolioData }) {
  const { profile, skills } = data;
  if (!profile) return null;
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    url: SITE_URL,
    address: profile.location,
    knowsAbout: skills.map((s) => s.name),
    sameAs: [profile.linkedin_url, profile.github_url].filter(Boolean),
  };
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, '\\u003c') }}
    />
  );
}
