/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        gray: colors.neutral,
      },
    },
    fontFamily: {
      'raleway': 'Raleway, sans-serif'
    }
  },
  plugins: [],
}
