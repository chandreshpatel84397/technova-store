import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9efff",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1"
        },
        ink: "#111827"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(15, 23, 42, 0.08)",
        glass: "0 20px 60px rgba(2, 132, 199, 0.18)"
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [],
};
export default config;
