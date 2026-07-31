/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#000000',
          secondary: '#030614',
          card: '#080C1E',
          glass: 'rgba(8, 12, 30, 0.65)',
        },
        brand: {
          cyan: '#34F5E6',
          cyanGlow: 'rgba(52, 245, 230, 0.35)',
          blue: '#78D7FF',
        },
        border: {
          glass: 'rgba(52, 245, 230, 0.2)',
          highlight: 'rgba(52, 245, 230, 0.4)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'Space Mono', 'monospace'],
      },
      boxShadow: {
        cyanGlow: '0 0 25px rgba(52, 245, 230, 0.15)',
        cyanGlowIntense: '0 0 35px rgba(52, 245, 230, 0.3)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};
