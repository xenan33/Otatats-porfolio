import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Sora } from 'next/font/google';
import { SITE_URL } from '@/lib/env';
import './globals.css';

const sora = Sora({ variable: '--font-sora', subsets: ['latin'], weight: ['500', '600', '700'] });
const plex = IBM_Plex_Sans({ variable: '--font-plex', subsets: ['latin'], weight: ['400', '500', '600'] });
const plexMono = IBM_Plex_Mono({ variable: '--font-plex-mono', subsets: ['latin'], weight: ['400', '500'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Otatats · Portfolio', template: '%s · Otatats' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${sora.variable} ${plex.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
