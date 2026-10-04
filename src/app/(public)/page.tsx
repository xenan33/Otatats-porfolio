import type { Metadata } from 'next';
import { connection } from 'next/server';
import JsonLd from '@/components/site/JsonLd';
import Portfolio from '@/components/site/Portfolio';
import { getPortfolio } from '@/lib/data';
import { getPhone } from '@/lib/private';

export async function generateMetadata(): Promise<Metadata> {
  const { profile, settings } = await getPortfolio();
  const title = settings.seo_title ?? (profile ? `${profile.name} · ${profile.headline ?? 'Portfolio'}` : 'Portfolio');
  const description = settings.seo_description ?? profile?.bio?.slice(0, 160) ?? undefined;
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, type: 'profile', images: settings.og_image_url ? [settings.og_image_url] : undefined },
  };
}

export default async function HomePage() {
  // Render per request: the CSP nonce changes every time and admin edits show immediately.
  await connection();
  const data = await getPortfolio();
  const phone = data.settings.show_phone ? await getPhone() : null;
  return (
    <>
      <JsonLd data={data} />
      <Portfolio data={data} phone={phone} />
    </>
  );
}
