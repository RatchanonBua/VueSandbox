/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "media",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    screens: {
      "bs-sm": "576px",
      "bs-md": "768px",
      "bs-lg": "992px",
      "bs-xl": "1200px",
    },
    extend: {},
  },
  plugins: [
    require("flowbite/plugin")
  ],
}

