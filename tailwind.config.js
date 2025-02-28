/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Thay bằng font mong muốn
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
  
};