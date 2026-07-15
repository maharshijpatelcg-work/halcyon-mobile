import React from "react";
import { View, Text, TextInput } from "react-native";
import { Card } from "../ui/Card";
import { useTheme } from "../../providers/ThemeProvider";

interface LogInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function LogInput({ value, onChangeText, placeholder }: LogInputProps) {
  const { colors, isDark } = useTheme();

  return (
    <Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase" }}>
          System Logs / Traceback
        </Text>
        <Text style={{ fontSize: 11, color: colors.textMuted }}>
          {value.length.toLocaleString()} chars
        </Text>
      </View>
      <TextInput
        multiline
        numberOfLines={10}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Paste server logs, execution traces, or system crash errors here..."}
        placeholderTextColor={colors.textMuted}
        style={{
          fontSize: 12,
          fontFamily: "monospace",
          color: colors.textPrimary,
          backgroundColor: isDark ? "#12121A" : "#F3F4F6",
          padding: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          minHeight: 180,
          textAlignVertical: "top",
        }}
      />
    </Card>
  );
}
