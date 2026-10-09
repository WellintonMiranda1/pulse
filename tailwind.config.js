/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pulse: {
          500: "#1769FF",
          600: "#0B57D0"
        }
      }
    }
  },
  plugins: []
};
