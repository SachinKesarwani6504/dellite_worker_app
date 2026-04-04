/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brandOrange: '#FF7A00',
        brandRed: '#FF3D5A',
        brandYellow: '#FFC53D',
        brandCream: '#FFF7E8',
        brandText: '#2D1B00',
        brandBlack: '#0F0F10',
      },
    },
  },
  plugins: [],
};
