import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useIncidents } from "../../src/hooks/useIncidents";
import { IncidentList } from "../../src/components/incidents/IncidentList";
import { SeverityFilter } from "../../src/components/incidents/SeverityFilter";
import type { Severity } from "../../src/types";
import { useTranslation } from "../../src/providers/LanguageProvider";
import { useTheme } from "../../src/providers/ThemeProvider";

export default function IncidentsScreen() {
  const router = useRouter();
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | null>(null);
  const { data, isLoading, isRefetching, refetch } = useIncidents({ severity: selectedSeverity });
  const { t } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();

  const handleSelectIncident = useCallback((id: number) => {
    router.push(`/incident/${id}`);
  }, [router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <Animated.View entering={FadeInDown.springify().damping(18)} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textPrimary }}>{t("incidents")}</Text>
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
              {data ? `${data.total} total` : "Loading..."}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable 
              onPress={toggleTheme} 
              style={({ pressed }) => ({
                width: 36, 
                height: 36, 
                borderRadius: 12, 
                backgroundColor: isDark ? "rgba(251,191,36,0.12)" : "rgba(99,102,241,0.12)", 
                alignItems: "center", 
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }]
              })}
            >
              <Ionicons name={isDark ? "sunny" : "moon"} size={16} color={isDark ? "#FBBF24" : "#6366F1"} />
            </Pressable>
            <Pressable style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: isDark ? "#1A1A26" : "#FFFFFF", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <SeverityFilter selectedSeverity={selectedSeverity} onSelect={setSelectedSeverity} />

      <IncidentList
        incidents={data?.incidents ?? []}
        isLoading={isLoading}
        isRefetching={isRefetching}
        onRefresh={refetch}
        onSelectIncident={handleSelectIncident}
      />
    </SafeAreaView>
  );
}
