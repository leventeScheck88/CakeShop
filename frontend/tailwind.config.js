/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: 'rgb(var(--color-cream) / <alpha-value>)',
        blush: 'rgb(var(--color-blush) / <alpha-value>)',
        'blush-dark': 'rgb(var(--color-blush-dark) / <alpha-value>)',
        gold: 'rgb(var(--color-gold) / <alpha-value>)',
        'gold-light': 'rgb(var(--color-gold-light) / <alpha-value>)',
        charcoal: 'rgb(var(--color-charcoal) / <alpha-value>)',
        'warm-gray': 'rgb(var(--color-warm-gray) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Lato', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
