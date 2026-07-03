/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#B30000',
          navy: '#0F172A',
          gray: '#F5F5F5',
          dark: '#0B0F19',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
