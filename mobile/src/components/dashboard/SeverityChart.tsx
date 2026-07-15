import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInRight, useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { Card } from "../ui/Card";
import { SEVERITY_COLORS } from "../../constants/colors";
import { useTheme } from "../../providers/ThemeProvider";
import type { Severity } from "../../types";

interface SeverityChartProps {
  bySeverity: Record<string, number>;
}

const SEVERITY_ORDER: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

function BarRow({ severity, count, total, index }: { severity: Severity; count: number; total: number; index: number }) {
  const sevColors = SEVERITY_COLORS[severity];
  const { colors, isDark } = useTheme();
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const width = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      width.value = withTiming(percentage, { duration: 800, easing: Easing.out(Easing.cubic) });
    }, index * 150);
    return () => clearTimeout(timer);
  }, [percentage, index, width]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.max(width.value, count > 0 ? 3 : 0)}%` as any,
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}
    >
      <Text style={{ fontSize: 12, color: colors.textSecondary, width: 60, fontWeight: "500" }}>
        {severity.charAt(0) + severity.slice(1).toLowerCase()}
      </Text>
      <View style={{ flex: 1, height: 20, backgroundColor: isDark ? "#12121A" : "#E5E7EB", borderRadius: 99, marginHorizontal: 12, overflow: "hidden" }}>
        <Animated.View
          style={[
            { height: "100%", borderRadius: 99, backgroundColor: sevColors.dot },
            barStyle,
          ]}
        />
      </View>
      <Text style={{ fontSize: 12, fontWeight: "700", width: 24, textAlign: "right", color: sevColors.text }}>
        {count}
      </Text>
    </Animated.View>
  );
}

import { useTranslation } from "../../providers/LanguageProvider";

export function SeverityChart({ bySeverity }: SeverityChartProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const total = Object.values(bySeverity).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginBottom: 16 }}>
        {t("severityDist")}
      </Text>
      {SEVERITY_ORDER.map((sev, i) => (
        <BarRow key={sev} severity={sev} count={bySeverity[sev] ?? 0} total={total} index={i} />
      ))}
    </Card>
  );
}
