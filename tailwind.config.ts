import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#F4F1EA', base: '#0b0a0a', panel: '#141212', row: '#151313',
        cfteal: '#17A2A2', discord: '#5865F2',
      },
      fontFamily: {
        anton: ['var(--font-anton)'], bebas: ['var(--font-bebas)'], oswald: ['var(--font-oswald)'],
      },
    },
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
  },
  plugins: [],
} satisfies Config;
