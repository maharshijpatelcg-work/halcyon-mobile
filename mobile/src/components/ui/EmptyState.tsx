import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";
import { useTheme } from "../../providers/ThemeProvider";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = "cube-outline", title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 64, paddingHorizontal: 32 }}>
      <View
        style={{
          width: 64, height: 64, borderRadius: 32,
          backgroundColor: isDark ? "#1A1A26" : "#F0F0F5", borderWidth: 1, borderColor: isDark ? "#2A2A3C" : "#E5E7EB",
          alignItems: "center", justifyContent: "center", marginBottom: 16,
        }}
      >
        <Ionicons name={icon} size={28} color={colors.textMuted} />
      </View>
      <Text style={{ fontSize: 17, fontWeight: "700", color: colors.textPrimary, textAlign: "center", marginBottom: 4 }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{ fontSize: 13, color: colors.textMuted, textAlign: "center", marginBottom: 24, lineHeight: 20 }}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="secondary" />
      )}
    </View>
  );
}
