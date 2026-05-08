/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        studio: {
          black: '#000000',
          panel: '#161616',
          green: '#90E06D',
          yellow: '#F7D147',
        },
      },
    },
  },
  plugins: [],
};
