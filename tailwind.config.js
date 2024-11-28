/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

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
        "gray-text": "#666F79",
        "dark-primary": "#1C1E21",
        "blue-primary": "#3687E2",
        "gray-primary": "rgba(54, 135, 226, 0.05);",
      },
      aspectRatio: {
        "4/3": "4 / 3",
      },
    },
    fontFamily: {
      raleway: "Raleway, sans-serif",
      rubik: "Rubik, sans-serif",
      segoe: "Segoe UI, sans-serif",
    },
  },
  plugins: [
    require("daisyui"),
    plugin(function ({ addUtilities }) {
      // Add your custom scrollbar utilities
      addUtilities({
        ".border-inside-grey": {
          "box-shadow": "inset 0 0 0 1px #E7EAED",
        },
        ".dropdown-boxShadow": {
          "box-shadow": "0px 4px 13.1px 0px rgba(0, 0, 0, 0.25)",
        },
      });
    }),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          // primary: "#3886E2",
          primary: "#3687E2",
        },
      },
    ],
  },
};
