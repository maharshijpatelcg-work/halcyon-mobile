import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "muted";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

/**
 * Pill-shaped badge for labels, tags, and status indicators.
 */
export function Badge({ label, variant = "default" }: BadgeProps) {
  const { isDark } = useTheme();

  const VARIANT_STYLES: Record<BadgeVariant, { bg: string; color: string }> = {
    default:  { bg: isDark ? "#2A2A3C" : "#E5E7EB",                  color: isDark ? "#9CA3AF" : "#4B5563" },
    accent:   { bg: "rgba(99, 102, 241, 0.15)", color: "#818CF8" },
    success:  { bg: "rgba(52, 211, 153, 0.12)", color: "#34D399" },
    warning:  { bg: "rgba(251, 191, 36, 0.12)", color: "#FBBF24" },
    danger:   { bg: "rgba(239, 68, 68, 0.12)",  color: "#EF4444" },
    muted:    { bg: isDark ? "#12121A" : "#F0F0F5",                   color: isDark ? "#6B7280" : "#6B7280" },
  };

  const s = VARIANT_STYLES[variant];
  return (
    <View style={{ backgroundColor: s.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
      <Text style={{ color: s.color, fontSize: 11, fontWeight: "600" }}>{label}</Text>
    </View>
  );
}
