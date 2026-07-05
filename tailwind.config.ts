import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
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
