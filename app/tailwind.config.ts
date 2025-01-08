/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Custom background colors for dark mode
        'background': {
          DEFAULT: 'white',
          dark: '#18181b', // zinc-900
        },
        'background-secondary': {
          DEFAULT: '#f4f4f5', // zinc-100
          dark: '#27272a', // zinc-800
        }
      }
    },
  },
  plugins: [],
};
