import React from "react";
import { ScrollView, Pressable, Text, View } from "react-native";
import { SEVERITY_COLORS } from "../../constants/colors";
import { useTheme } from "../../providers/ThemeProvider";
import type { Severity } from "../../types";

interface SeverityFilterProps {
  selectedSeverity: Severity | null;
  onSelect: (severity: Severity | null) => void;
}

const OPTIONS: (Severity | null)[] = [null, "CRITICAL", "HIGH", "MEDIUM", "LOW"];

export function SeverityFilter({ selectedSeverity, onSelect }: SeverityFilterProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ 
      borderBottomWidth: 1, 
      borderBottomColor: colors.borderSubtle, 
      paddingVertical: 12, 
      backgroundColor: isDark ? "#12121A" : "#FFFFFF" 
    }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {OPTIONS.map((sev) => {
          const isSelected = selectedSeverity === sev;
          const label = sev ?? "All";
          const sevColors = sev ? SEVERITY_COLORS[sev] : null;

          return (
            <Pressable
              key={label}
              onPress={() => onSelect(sev)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 99,
                borderWidth: 1,
                backgroundColor: isSelected ? "#6366F1" : (isDark ? "#1A1A26" : "#F3F4F6"),
                borderColor: isSelected ? "#6366F1" : colors.border,
              }}
            >
              {sevColors && (
                <View style={{
                  width: 8, height: 8, borderRadius: 4, marginRight: 8,
                  backgroundColor: isSelected ? "#fff" : sevColors.dot,
                }} />
              )}
              <Text style={{ fontSize: 12, fontWeight: "600", color: isSelected ? "#fff" : colors.textSecondary }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
