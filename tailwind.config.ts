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
        // Category accent tokens (used via src/lib/accents.ts). Disciplined,
        // flat colors — deliberately NOT indigo→purple gradients.
        cat: {
          visa: { DEFAULT: "#c2660c", soft: "#fff7ed" }, // saffron — Visa & Green Card
          money: { DEFAULT: "#047857", soft: "#ecfdf5" }, // emerald — Money & Tax
          travel: { DEFAULT: "#6d28d9", soft: "#f5f3ff" }, // violet — Travel & Passport
          docs: { DEFAULT: "#475569", soft: "#f1f5f9" }, // slate — Documents & Process
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
