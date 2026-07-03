import type { Metadata } from 'next';
import { Anton, Bebas_Neue, Oswald } from 'next/font/google';
import './globals.css';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const oswald = Oswald({ weight: ['300','400','500','600','700'], subsets: ['latin'], variable: '--font-oswald' });

export const metadata: Metadata = {
  title: 'RAMENNAGI — Phantom Thief of Algorithms',
  description: 'Persona 5 styled portfolio of Kenaz Celestino (@Kencel / CF @RamenNagi).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${bebas.variable} ${oswald.variable}`}>
      <body style={{ margin: 0, background: '#0b0a0a', color: '#F4F1EA', fontFamily: 'var(--font-oswald), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
