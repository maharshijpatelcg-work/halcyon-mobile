import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../ui/Card";
import { AnimatedCounter } from "../ui/AnimatedCounter";
import { useTranslation } from "../../providers/LanguageProvider";
import { useTheme } from "../../providers/ThemeProvider";
import type { DashboardStats } from "../../types";

interface StatsGridProps {
  stats: DashboardStats;
}

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  index: number;
}

function StatItem({ label, value, suffix, icon, iconColor, index }: StatItemProps) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify().damping(18)}
      style={{ flex: 1 }}
    >
      <Card variant="default">
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <View
            style={{
              width: 28, height: 28, borderRadius: 8,
              backgroundColor: iconColor + "20",
              alignItems: "center", justifyContent: "center", marginRight: 8,
            }}
          >
            <Ionicons name={icon} size={14} color={iconColor} />
          </View>
          <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" }}>
            {label}
          </Text>
        </View>
        <AnimatedCounter value={value} suffix={suffix} style={{ fontSize: 26 }} />
      </Card>
    </Animated.View>
  );
}

export function StatsGrid({ stats }: StatsGridProps) {
  const { t } = useTranslation();

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        <StatItem label={t("total")} value={stats.total_incidents} icon="layers-outline" iconColor="#6366F1" index={0} />
        <StatItem label={t("open")} value={stats.open_incidents} icon="alert-circle-outline" iconColor="#F97316" index={1} />
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <StatItem label={t("resolved")} value={stats.solved_incidents} icon="checkmark-circle-outline" iconColor="#34D399" index={2} />
        <StatItem label={t("rate")} value={stats.resolution_rate} suffix="%" icon="trending-up-outline" iconColor="#818CF8" index={3} />
      </View>
    </View>
  );
}
