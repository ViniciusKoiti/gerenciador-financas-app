/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976d2',
          dark: '#1565c0'
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Isso é importante quando usando com Angular Material
  }
}