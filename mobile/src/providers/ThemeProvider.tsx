import React, { createContext, useContext, useState } from "react";

export type ThemeMode = "dark" | "light";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  tabBar: string;
  tabBarBorder: string;
  cardOverlay: string;
}

const darkColors: ThemeColors = {
  background: "#0A0A0F",
  surface: "#12121A",
  surfaceElevated: "#1A1A26",
  border: "#2A2A3C",
  borderSubtle: "rgba(42,42,60,0.3)",
  textPrimary: "#F1F1F4",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
  accent: "#6366F1",
  accentSoft: "rgba(99,102,241,0.15)",
  tabBar: "#12121A",
  tabBarBorder: "#2A2A3C",
  cardOverlay: "rgba(10,10,15,0.9)",
};

const lightColors: ThemeColors = {
  background: "#F5F5F8",
  surface: "#FFFFFF",
  surfaceElevated: "#F0F0F5",
  border: "#D1D5DB",
  borderSubtle: "rgba(209,213,219,0.5)",
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textMuted: "#9CA3AF",
  accent: "#6366F1",
  accentSoft: "rgba(99,102,241,0.12)",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E5E7EB",
  cardOverlay: "rgba(0,0,0,0.5)",
};

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const colors = theme === "dark" ? darkColors : lightColors;
  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
