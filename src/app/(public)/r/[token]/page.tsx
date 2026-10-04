import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Portfolio from '@/components/site/Portfolio';
import { getPortfolio } from '@/lib/data';
import { getPhone, openShareLink } from '@/lib/private';

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Recruiter share link: same portfolio, optionally revealing the phone number,
// and every visit is counted for the owner.
export default async function SharePage({ params }: PageProps<'/r/[token]'>) {
  const { token } = await params;
  const link = await openShareLink(token);
  if (!link) notFound();
  const data = await getPortfolio();
  const phone = link.revealPhone || data.settings.show_phone ? await getPhone() : null;
  return <Portfolio data={data} phone={phone} />;
}
