
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carolina: '#7BAFD4',
        navy: '#13294B',
        sand: '#E1D8B7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        header: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
