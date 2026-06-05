import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd3ff",
          300: "#8eb6ff",
          400: "#598dff",
          500: "#3563ff",
          600: "#1e40f5",
          700: "#172fe1",
          800: "#1929b6",
          900: "#1b298f",
          950: "#141a57",
        },
        accent: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        ink: {
          900: "#0b1120",
          800: "#111827",
          700: "#1f2937",
          600: "#374151",
          500: "#4b5563",
          400: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      maxWidth: {
        prose: "70ch",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -12px rgba(16,24,40,0.16)",
        "card-hover":
          "0 1px 2px rgba(16,24,40,0.06), 0 18px 40px -16px rgba(16,24,40,0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
