import React from "react";
import { ScrollView, View, Text, RefreshControl, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useDashboardStats } from "../../src/hooks/useDashboardStats";
import { useIncidents } from "../../src/hooks/useIncidents";
import { StatsGrid } from "../../src/components/dashboard/StatsGrid";
import { SeverityChart } from "../../src/components/dashboard/SeverityChart";
import { AIMetricsCard } from "../../src/components/dashboard/AIMetricsCard";
import { RecentIncidents } from "../../src/components/dashboard/RecentIncidents";
import { StatusDot } from "../../src/components/ui/StatusDot";
import { SkeletonStatCard, SkeletonCard } from "../../src/components/ui/SkeletonLoader";
import { Logo } from "../../src/components/ui/Logo";
import { useTranslation } from "../../src/providers/LanguageProvider";
import { useTheme } from "../../src/providers/ThemeProvider";

export default function DashboardScreen() {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: incidentData, isLoading: incidentsLoading, refetch: refetchIncidents } = useIncidents({ page: 1 });
  const [refreshing, setRefreshing] = React.useState(false);
  const { t } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchIncidents()]);
    setRefreshing(false);
  }, [refetchStats, refetchIncidents]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.springify().damping(18)} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Logo size={28} />
              <Text style={{ fontSize: 18, fontWeight: "800", color: colors.textPrimary }}>HALCYON</Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>{t("incidentAgent")}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <StatusDot status="online" size={6} />
              <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "500" }}>{t("online")}</Text>
            </View>
            <Pressable 
              onPress={toggleTheme} 
              style={({ pressed }) => ({
                width: 34, 
                height: 34, 
                borderRadius: 10, 
                backgroundColor: isDark ? "rgba(251,191,36,0.12)" : "rgba(99,102,241,0.12)", 
                alignItems: "center", 
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }]
              })}
            >
              <Ionicons name={isDark ? "sunny" : "moon"} size={16} color={isDark ? "#FBBF24" : "#6366F1"} />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" colors={["#6366F1"]} />}
      >
        {/* Stats */}
        {statsLoading && !stats ? (
          <View>
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
              <SkeletonStatCard />
              <SkeletonStatCard />
            </View>
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
              <SkeletonStatCard />
              <SkeletonStatCard />
            </View>
          </View>
        ) : stats ? (
          <View style={{ marginBottom: 20 }}>
            <StatsGrid stats={stats} />
          </View>
        ) : null}

        {stats && (
          <Animated.View entering={FadeInDown.delay(200).springify().damping(18)} style={{ marginBottom: 20 }}>
            <SeverityChart bySeverity={stats.by_severity} />
          </Animated.View>
        )}

        {stats && (
          <View style={{ marginBottom: 20 }}>
            <AIMetricsCard stats={stats} />
          </View>
        )}

        {incidentsLoading && !incidentData ? (
          <View><SkeletonCard /><SkeletonCard /></View>
        ) : incidentData ? (
          <Animated.View entering={FadeInDown.delay(400).springify().damping(18)}>
            <RecentIncidents incidents={incidentData.incidents} />
          </Animated.View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
