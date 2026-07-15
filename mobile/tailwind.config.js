/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: "#0A0A0F",
          surface: "#12121A",
          card: "#1A1A26",
          border: "#2A2A3C",
          "border-light": "#3A3A50",
          accent: "#6366F1",
          "accent-light": "#818CF8",
          "accent-glow": "rgba(99, 102, 241, 0.15)",
          text: "#F1F1F4",
          "text-secondary": "#9CA3AF",
          "text-muted": "#6B7280",
        },
        severity: {
          critical: "#EF4444",
          "critical-bg": "rgba(239, 68, 68, 0.12)",
          high: "#F97316",
          "high-bg": "rgba(249, 115, 22, 0.12)",
          medium: "#FBBF24",
          "medium-bg": "rgba(251, 191, 36, 0.12)",
          low: "#34D399",
          "low-bg": "rgba(52, 211, 153, 0.12)",
        },
        status: {
          online: "#34D399",
          offline: "#EF4444",
          warning: "#FBBF24",
        },
      },
      fontFamily: {
        sans: ["Inter_400Regular", "System"],
        medium: ["Inter_500Medium", "System"],
        semibold: ["Inter_600SemiBold", "System"],
        bold: ["Inter_700Bold", "System"],
      },
    },
  },
  plugins: [],
};
