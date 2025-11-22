/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'egyptian-gold': {
          DEFAULT: '#D4AF37',
          light: '#E5C766',
          dark: '#B8941F',
        },
      },
    },
  },
  plugins: [],
}
