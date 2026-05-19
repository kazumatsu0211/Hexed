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
          dark: '#1a1410',
          mid: '#2a2018',
          light: '#3a2e22',
        },
        accent: {
          gold: '#c9a961',
          'gold-dim': '#8a7240',
          blood: '#ef4444',
          curse: '#a855f7',
          blessing: '#22c55e',
        },
      },
      fontFamily: {
        title: ['"Cinzel"', '"Noto Serif JP"', 'serif'],
        serif: ['"Cormorant Garamond"', '"Noto Serif JP"', 'serif'],
        body: ['"Cormorant Garamond"', '"Noto Serif JP"', 'serif'],
        jp: ['"Noto Serif JP"', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 28px rgba(201,169,97,0.28), 0 0 60px rgba(201,169,97,0.1), inset 0 0 24px rgba(201,169,97,0.06)',
        'gold-glow-sm': '0 0 14px rgba(201,169,97,0.25)',
        'gold-glow-xs': '0 0 12px rgba(201,169,97,0.2)',
        'panel-deep': '0 6px 24px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'casino-radial': 'radial-gradient(ellipse at 50% 35%, #2d2114 0%, #1a1410 55%, #0a0806 100%)',
        'casino-radial-play': 'radial-gradient(ellipse at 50% 40%, #261d12 0%, #1a1410 55%, #080604 100%)',
        'vignette': 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-gold-glow': {
          'text-shadow': '0 0 40px rgba(201,169,97,0.35), 0 0 80px rgba(201,169,97,0.15), 0 2px 8px rgba(0,0,0,0.9)',
        },
        '.text-shadow-gold': {
          'text-shadow': '0 0 30px rgba(201,169,97,0.3)',
        },
        '.text-shadow-gold-soft': {
          'text-shadow': '0 0 16px rgba(201,169,97,0.4)',
        },
      });
    },
  ],
}
