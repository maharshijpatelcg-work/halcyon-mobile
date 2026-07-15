import React from "react";
import { View, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../providers/ThemeProvider";

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  accentColor?: string;
}

/**
 * Glassmorphism card with gradient top-border accent for premium depth.
 */
export function GlassCard({ children, accentColor = "rgba(99, 102, 241, 0.4)", style, ...props }: GlassCardProps) {
  const { isDark } = useTheme();

  return (
    <View
      style={[{ borderRadius: 16, overflow: "hidden" }, style]}
      {...props}
    >
      <LinearGradient
        colors={[accentColor, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5 }}
      />
      <View
        style={{
          backgroundColor: isDark ? "rgba(26, 26, 38, 0.92)" : "rgba(255, 255, 255, 0.95)",
          borderWidth: 1,
          borderColor: isDark ? "#2A2A3C" : "#E5E7EB",
          borderRadius: 16,
          padding: 16,
        }}
      >
        {children}
      </View>
    </View>
  );
}
