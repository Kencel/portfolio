import type { Metadata } from 'next';
import { Anton, Bebas_Neue, Oswald } from 'next/font/google';
import { COLOR, FONT } from '@/lib/tokens';
import './globals.css';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const oswald = Oswald({ weight: ['300','400','500','600','700'], subsets: ['latin'], variable: '--font-oswald' });

const SITE_URL = 'https://www.kenazc.com';
const DESCRIPTION =
  'Portfolio of Kenaz Celestino: computer science student at Ateneo de Manila, competitive programmer (@RamenNagi).';

export const metadata: Metadata = {
  // Resolves relative URLs in the tags below (and lets the app/opengraph-image
  // file convention emit an absolute og:image, which link scrapers require).
  metadataBase: new URL(SITE_URL),
  title: 'RAMENNAGI',
  description: DESCRIPTION,
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'RAMENNAGI',
    title: 'RAMENNAGI — Kenaz Celestino',
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAMENNAGI — Kenaz Celestino',
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: some browser extensions (e.g. NightEye) inject
    // attributes onto <html>/<body> before React hydrates. This only silences
    // attribute mismatches on these two elements, not real mismatches deeper in
    // the tree.
    <html lang="en" suppressHydrationWarning className={`${anton.variable} ${bebas.variable} ${oswald.variable}`}>
      <body suppressHydrationWarning style={{ margin: 0, background: COLOR.base, color: COLOR.ink, fontFamily: FONT.oswald }}>
        {children}
      </body>
    </html>
  );
}
