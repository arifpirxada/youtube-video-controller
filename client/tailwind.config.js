/** Tailwind configuration for the frontend */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system'],
      },
      colors: {
        brand: {
          500: '#4f46e5',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
