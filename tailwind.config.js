/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        highlight: {
          '0%': { backgroundColor: 'rgba(255, 235, 0, 1)' },
          '100%': { backgroundColor: 'transparent' }
        }
      },
      animation: {
        highlight: 'highlight 3s ease-in-out'
      }
    }
  },
}