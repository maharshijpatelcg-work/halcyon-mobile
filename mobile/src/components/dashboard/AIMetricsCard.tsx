import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../ui/GlassCard";
import { formatCost, formatPercentage } from "../../utils/formatters";
import { useTheme } from "../../providers/ThemeProvider";
import type { DashboardStats } from "../../types";

interface AIMetricsCardProps {
  stats: DashboardStats;
}

function MetricRow({ icon, iconColor, label, value }: { icon: keyof typeof Ionicons.glyphMap; iconColor: string; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={icon} size={16} color={iconColor} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>{label}</Text>
      </View>
      <Text style={{ fontSize: 12, fontWeight: "700", color: colors.textPrimary }}>{value}</Text>
    </View>
  );
}

import { useTranslation } from "../../providers/LanguageProvider";

export function AIMetricsCard({ stats }: AIMetricsCardProps) {
  const { ai_decisions } = stats;
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(300).springify().damping(18)}>
      <GlassCard>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(99,102,241,0.15)", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
            <Ionicons name="hardware-chip-outline" size={14} color="#818CF8" />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textPrimary }}>{t("aiEngineMetrics")}</Text>
        </View>
        <MetricRow icon="git-branch-outline" iconColor="#818CF8" label="Total Decisions" value={String(ai_decisions.total_decisions)} />
        <View style={{ height: 1, backgroundColor: colors.borderSubtle }} />
        <MetricRow icon="wallet-outline" iconColor="#34D399" label="Total Cost" value={formatCost(ai_decisions.total_cost)} />
        <View style={{ height: 1, backgroundColor: colors.borderSubtle }} />
        <MetricRow icon="flash-outline" iconColor="#FBBF24" label="Memory Hit Rate" value={formatPercentage(ai_decisions.memory_hit_rate)} />
        <View style={{ height: 1, backgroundColor: colors.borderSubtle }} />
        <MetricRow icon="arrow-up-outline" iconColor="#F97316" label="Escalations" value={String(ai_decisions.escalations)} />
      </GlassCard>
    </Animated.View>
  );
}
