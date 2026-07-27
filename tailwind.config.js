/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
          light: '#a78bfa',
        },
        secondary: {
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
          light: '#93c5fd',
        },
      },
      fontFamily: {
        cursive: ["'Cursive'", "'Fantasy'"],
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
