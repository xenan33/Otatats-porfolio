import type { Metadata } from 'next';
import { connection } from 'next/server';
import JsonLd from '@/components/site/JsonLd';
import Portfolio from '@/components/site/Portfolio';
import { getPortfolio } from '@/lib/data';
import { getPhone } from '@/lib/private';
import { SEASONS, seasonFor, type Season } from '@/lib/season';

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

export default async function HomePage({ searchParams }: PageProps<'/'>) {
  // Render per request: the CSP nonce changes every time and admin edits show immediately.
  await connection();
  const data = await getPortfolio();
  const phone = data.settings.show_phone ? await getPhone() : null;
  // ?season=halloween|christmas|newyear previews a theme on any date.
  const preview = (await searchParams).season;
  const season = SEASONS.includes(preview as Season)
    ? (preview as Season)
    : data.settings.seasonal_themes
      ? seasonFor(new Date())
      : null;
  return (
    <>
      <JsonLd data={data} />
      <Portfolio data={data} phone={phone} season={season} />
    </>
  );
}
