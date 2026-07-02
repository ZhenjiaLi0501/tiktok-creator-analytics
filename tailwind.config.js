/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        youyin: {
          red: '#FE2C55',
          cyan: '#00F2EA',
          dark: '#0B0F19',
          panel: '#111827',
        },
      },
    },
  },
  plugins: [],
};
