/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      animation: {
        vote: "vote 1s ease-in-out",
      },
      keyframes: {
        vote: {
          "0%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(-20deg)",
          },
          "75%": {
            transform: "rotate(15deg)",
          },
        },
      },
      colors: {
        gray: colors.neutral,
      },
      aspectRatio: {
        "4/3": "4 / 3",
      },
    },
    fontFamily: {
      raleway: "Raleway, sans-serif",
      rubik: "Rubik, sans-serif",
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#3886E2",
        },
      },
    ],
  },
};
