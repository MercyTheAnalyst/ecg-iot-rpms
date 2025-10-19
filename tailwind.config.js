/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0ea5e9",
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
        },
        secondary: {
          DEFAULT: "#8b5cf6",
          500: "#8b5cf6",
        },
        danger: {
          DEFAULT: "#ef4444",
          500: "#ef4444",
        },
        warning: {
          DEFAULT: "#f59e0b",
          500: "#f59e0b",
        },
        success: {
          DEFAULT: "#10b981",
          500: "#10b981",
        },
      },
    },
  },
  plugins: [],
};
