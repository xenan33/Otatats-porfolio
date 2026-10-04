import type { MetadataRoute } from 'next';

export const revalidate = 3600;
import { getPortfolio } from '@/lib/data';
import { SITE_URL } from '@/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getPortfolio();
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    ...projects.filter((p) => p.long_description).map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, priority: 0.6 })),
  ];
}
