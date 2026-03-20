/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Professional "Bloomberg/Reuters" style colors
      colors: {
        financial: {
          up: "#22c55e", // Green
          down: "#ef4444", // Red
          neutral: "#64748b",
          border: "#e2e8f0",
        },
      },
    },
  },
  plugins: [],
};
