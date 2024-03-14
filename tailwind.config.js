/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#802BD6',
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}
