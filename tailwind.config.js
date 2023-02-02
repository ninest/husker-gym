/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./style/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      gridTemplateColumns: {
        // Week view grid
        week: "minmax(50px,1fr) 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
      },
    },
  },
  plugins: [],
};
