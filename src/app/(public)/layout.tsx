import type { Metadata } from 'next';
import CopyGuard from '@/components/site/CopyGuard';
import { getPortfolio } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  return profile ? { title: { default: profile.name, template: `%s · ${profile.name}` } } : {};
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CopyGuard />
      {children}
    </>
  );
}
