import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        "primary-hover": "#1D4ED8",
        secondary: "#0F172A",
        accent: "#14B8A6",
        surface: "#FFFFFF",
        "surface-hover": "#F1F5F9",
        muted: "#6B7280",
        success: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        },
      },
    },
  },
  plugins: [],
};

export default config;
