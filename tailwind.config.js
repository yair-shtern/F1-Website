/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'f1-red': '#E10600',
          'f1-blue': '#2D7FBF',
          'f1-background': '#F1F1F1'
        },
        fontFamily: {
          'f1': ['Formula1', 'sans-serif']
        }
      },
    },
    plugins: [],
  }