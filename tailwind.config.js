/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#030614',
          secondary: '#0B1124',
          card: '#0F172A',
        },
      },
    },
  },
  plugins: [],
};
