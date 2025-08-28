/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary-blue': '#2563EB',
        'secondary-indigo': '#4F46E5',
        'light-bg': '#F9FAFB',
        'dark-text': '#1F2937',
        'cta-green': '#10B981',
      }
    },
  },
  plugins: [],
}