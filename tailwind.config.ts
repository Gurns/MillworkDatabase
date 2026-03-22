import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f0',
          100: '#f9eddb',
          200: '#f2d7b0',
          300: '#e9bb7d',
          400: '#df9848',
          500: '#d87c25',
          600: '#c4641b',
          700: '#a34c19',
          800: '#853d1c',
          900: '#6d331a',
          950: '#3b190b',
        },
        wood: {
          50: '#faf6f1',
          100: '#f0e8da',
          200: '#e0ceb3',
          300: '#cdae85',
          400: '#bd9261',
          500: '#b17e4c',
          600: '#a06941',
          700: '#855237',
          800: '#6d4432',
          900: '#5a392b',
          950: '#301c15',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
