/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'budget-primary': '#2563eb',
        'budget-secondary': '#64748b',
        'budget-success': '#22c55e',
        'budget-warning': '#f59e0b',
        'budget-danger': '#ef4444',
      },
    },
  },
  plugins: [],
} 