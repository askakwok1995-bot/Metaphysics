/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'mystic-ink': '#05070b',
        'mystic-gold': '#be9956',
        'mystic-plum': '#563885',
      },
      boxShadow: {
        panel: '0 24px 120px rgba(0, 0, 0, 0.42)',
        'glow-gold': '0 28px 90px rgba(190, 153, 86, 0.12)',
        'card-soft': '0 24px 72px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
}
