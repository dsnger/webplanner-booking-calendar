/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
   
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'day-available': 'var(--day-available)',
        'day-closed': 'var(--day-closed)',
        'day-unavailable': 'var(--day-unavailable)',
        'day-onrequest': 'var(--day-onrequest)',
        'day-booked': 'var(--day-booked)',
        'day-hover': 'var(--day-hover)',
        'day-selected': 'var(--day-selected)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": "fadeIn 1.5s ease-in-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}