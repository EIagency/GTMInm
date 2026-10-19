import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#122022',
        deep: {
          DEFAULT: '#10191B',
          2: '#182325',
          3: '#202F30',
        },
        cream: '#F5F5EF',
        line: '#DFE2D9',
        muted: '#6E7874',
        lime: {
          DEFAULT: '#D5EE83',
          hover: '#E6F5AA',
        },
        mint: '#9BD2B7',
        sage: '#789780',
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tightest: '-0.07em',
      },
    },
  },
  plugins: [],
};

export default config;

