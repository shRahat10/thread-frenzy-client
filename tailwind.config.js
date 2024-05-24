/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: '"Raleway", sans-serif'
      },
      colors: {
        primary: '',
        footer: ''
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

