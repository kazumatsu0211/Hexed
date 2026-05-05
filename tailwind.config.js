/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0a0908',
          mid: '#1a1611',
          light: '#2a2520',
        },
        accent: {
          gold: '#c9a961',
          'gold-dim': '#8a7240',
          blood: '#ef4444',
          curse: '#a855f7',
        },
      },
      fontFamily: {
        title: ['"Cinzel"', 'serif'],
        body: ['"Crimson Text"', 'serif'],
      },
    },
  },
  plugins: [],
}
