/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#6366f1', dark: '#4f46e5', light: '#a5b4fc' },
        safe:     { DEFAULT: '#059669', light: '#d1fae5' },
        warm:     { DEFAULT: '#d97706', light: '#fef3c7' },
        calm:     { DEFAULT: '#0891b2', light: '#cffafe' },
        soft:     { DEFAULT: '#f8f7ff' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
