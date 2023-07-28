/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        gray: colors.neutral,
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
    fontFamily: {
      raleway: 'Raleway, sans-serif',
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          primary: '#3886E2',
        },
      },
    ],
  },
};
