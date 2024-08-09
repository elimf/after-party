/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["'Cursive'", "'Fantasy'"],
      },
      colors: {
        customYellow: "#f0db4f",
      },
      textShadow: {
        custom: "2px 2px 4px #000000",
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
}
