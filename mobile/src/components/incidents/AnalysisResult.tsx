import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../ui/Card";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { formatCost, formatLatency, formatPercentage } from "../../utils/formatters";
import { useTheme } from "../../providers/ThemeProvider";
import type { AIAnalysisResult, RoutingInfo, MemoryInfo } from "../../types";

interface AnalysisResultProps {
  analysis: AIAnalysisResult;
  routing?: RoutingInfo;
  memory?: MemoryInfo;
}

function InfoRow({ icon, iconColor, label, value, rightElement }: {
  icon: keyof typeof Ionicons.glyphMap; iconColor: string; label: string; value?: string; rightElement?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={icon} size={14} color={iconColor} style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>{label}</Text>
      </View>
      {rightElement ?? <Text style={{ fontSize: 12, fontWeight: "700", color: colors.textPrimary }}>{value}</Text>}
    </View>
  );
}

export function AnalysisResult({ analysis, routing, memory }: AnalysisResultProps) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 16 }}>
      {/* Root Cause */}
      <GlassCard accentColor="#6366F1">
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Ionicons name="bulb-outline" size={18} color="#818CF8" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 14, fontWeight: "800", color: colors.textPrimary }}>Root Cause Analysis</Text>
        </View>
        <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 20 }}>{analysis.root_cause}</Text>
      </GlassCard>

      {/* Fix */}
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Ionicons name="build-outline" size={18} color="#34D399" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 14, fontWeight: "800", color: colors.textPrimary }}>Suggested Remediation</Text>
        </View>
        <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 20 }}>{analysis.fix_suggestion}</Text>
      </Card>

      {/* Affected Components */}
      {analysis.affected_components.length > 0 && (
        <Card>
          <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            Affected Components
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {analysis.affected_components.map((comp) => (
              <Badge key={comp} label={comp} variant="muted" />
            ))}
          </View>
        </Card>
      )}

      {/* Decision Trace */}
      {(routing || memory) && (
        <Card>
          <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
            AI Decision Trace
          </Text>
          {memory?.consulted && (
            <InfoRow icon="journal-outline" iconColor="#9CA3AF" label="Memory Hit"
              rightElement={<Badge label={memory.hit ? `Hit (${formatPercentage(memory.match_score * 100)})` : "Miss"} variant={memory.hit ? "success" : "default"} />}
            />
          )}
          {routing && (
            <>
              <InfoRow icon="hardware-chip-outline" iconColor="#9CA3AF" label="Model Used" value={routing.model_used} />
              <InfoRow icon="wallet-outline" iconColor="#9CA3AF" label="Analysis Cost" value={formatCost(routing.cost)} />
              <InfoRow icon="time-outline" iconColor="#9CA3AF" label="Latency" value={formatLatency(routing.latency_ms)} />
              <InfoRow icon="git-compare-outline" iconColor="#9CA3AF" label="Routing Tier" value={routing.model_tier.toUpperCase()} />
            </>
          )}
        </Card>
      )}
    </View>
  );
}
