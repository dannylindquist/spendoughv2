const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/views/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: "Avenir, 'Avenir Next LT Pro', Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif",
      },
      colors: {
        gray: colors.stone,
      },
    },
  },
  plugins: [],
};
