/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#030303',
        body: '#1A1A1B',
        lightGray: '#d7dadc',
        mediumGray: '#c4c9cb',
        mainRed: '#ff4500',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      screens: {
        sm: '480px',
      },
    },
  },
  plugins: [],
};
