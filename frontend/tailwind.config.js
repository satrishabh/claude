/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf4f0',
          100: '#fbe4d8',
          200: '#f6c5a8',
          300: '#f09e70',
          400: '#e87040',
          500: '#d9521e',
          600: '#b83d15',
          700: '#952e12',
          800: '#7a2614',
          900: '#652314',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
