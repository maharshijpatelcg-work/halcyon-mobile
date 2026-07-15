import React from "react";
import { View, Text, ScrollView } from "react-native";
import { AnalysisResult } from "../incidents/AnalysisResult";
import { SeverityBadge } from "../ui/SeverityBadge";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useTheme } from "../../providers/ThemeProvider";
import type { IncidentSubmitResponse } from "../../types";

interface ResultViewProps {
  response: IncidentSubmitResponse;
  onReset: () => void;
}

export function ResultView({ response, onReset }: ResultViewProps) {
  const { colors, isDark } = useTheme();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <SeverityBadge severity={response.analysis.severity} />
          {response.resolved_from_memory && <Badge label="From Hindsight" variant="success" />}
        </View>
        <Button title="New Analysis" onPress={onReset} variant="ghost" style={{ paddingVertical: 8, paddingHorizontal: 12 }} />
      </View>

      <View style={{ 
        backgroundColor: isDark ? "#1A1A26" : "#FFFFFF", 
        borderWidth: 1, 
        borderColor: colors.border, 
        borderRadius: 16, 
        padding: 16 
      }}>
        <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
          AI Summary
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textPrimary, lineHeight: 22 }}>
          {response.analysis.summary}
        </Text>
      </View>

      <AnalysisResult analysis={response.analysis} routing={response.routing} memory={response.memory} />
    </ScrollView>
  );
}
