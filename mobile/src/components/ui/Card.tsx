import React from "react";
import { View, type ViewProps } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
}

/**
 * Base card component — adapts to current theme with subtle border.
 * Supports 3 variants for visual hierarchy.
 */
export function Card({ children, variant = "default", style, ...props }: CardProps) {
  const { colors, isDark } = useTheme();

  const variantStyles = {
    default: {
      backgroundColor: isDark ? "#1A1A26" : "#FFFFFF",
      borderColor: isDark ? "#2A2A3C" : "#E5E7EB",
      borderWidth: 1,
    },
    elevated: {
      backgroundColor: isDark ? "#1E1E2E" : "#FFFFFF",
      borderColor: isDark ? "#2A2A3C" : "#E5E7EB",
      borderWidth: 1,
      shadowColor: isDark ? "#6366F1" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.08 : 0.06,
      shadowRadius: 12,
      elevation: 4,
    },
    outlined: {
      backgroundColor: "transparent",
      borderColor: isDark ? "#3A3A50" : "#D1D5DB",
      borderWidth: 1,
    },
  };

  return (
    <View
      style={[
        {
          borderRadius: 16,
          padding: 16,
          ...variantStyles[variant],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
