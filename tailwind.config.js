/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      padding: {
        cnt: '20px',
      },

      colors: {
        // add custom colours here
        primary: '#03C04A',
        primaryDark: '#1B612C',
      },
    },
  },

  plugins: [],
};
