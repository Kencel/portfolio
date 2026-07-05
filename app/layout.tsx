import type { Metadata } from 'next';
import { Anton, Bebas_Neue, Oswald } from 'next/font/google';
import './globals.css';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const oswald = Oswald({ weight: ['300','400','500','600','700'], subsets: ['latin'], variable: '--font-oswald' });

export const metadata: Metadata = {
  title: 'RAMENNAGI',
  description: 'Persona 5 styled portfolio of Kenaz Celestino (@Kencel / CF @RamenNagi).',
  icons: {
    icon: "icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: some browser extensions (e.g. NightEye) inject
    // attributes onto <html>/<body> before React hydrates. This only silences
    // attribute mismatches on these two elements, not real mismatches deeper in
    // the tree.
    <html lang="en" suppressHydrationWarning className={`${anton.variable} ${bebas.variable} ${oswald.variable}`}>
      <body suppressHydrationWarning style={{ margin: 0, background: '#0b0a0a', color: '#F4F1EA', fontFamily: 'var(--font-oswald), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
