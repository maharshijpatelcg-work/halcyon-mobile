import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SeverityBadge } from "../ui/SeverityBadge";
import { formatRelativeTime } from "../../utils/formatters";
import { useTheme } from "../../providers/ThemeProvider";
import { useTranslation } from "../../providers/LanguageProvider";
import type { Incident } from "../../types";

interface RecentIncidentsProps {
  incidents: Incident[];
}

export function RecentIncidents({ incidents }: RecentIncidentsProps) {
  const router = useRouter();
  const recent = incidents.slice(0, 5);
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  return (
    <View style={{ 
      backgroundColor: isDark ? "#1A1A26" : "#FFFFFF", 
      borderColor: colors.border, 
      borderWidth: 1, 
      borderRadius: 16, 
      overflow: "hidden" 
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textPrimary }}>{t("recentIncidents")}</Text>
        <Pressable onPress={() => router.push("/(tabs)/incidents")}>
          <Text style={{ fontSize: 12, color: "#818CF8", fontWeight: "600" }}>{t("viewAll")}</Text>
        </Pressable>
      </View>

      {recent.map((incident, index) => (
        <Animated.View key={incident.id} entering={FadeInDown.delay(index * 80).springify().damping(18)}>
          <Pressable
            onPress={() => router.push(`/incident/${incident.id}`)}
            style={{
              flexDirection: "row", alignItems: "center",
              paddingHorizontal: 16, paddingVertical: 12,
              borderTopWidth: 1, borderTopColor: colors.borderSubtle,
            }}
          >
            <View style={{ marginRight: 12 }}>
              <SeverityBadge severity={incident.severity} size="sm" showDot={false} />
            </View>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ fontSize: 13, color: colors.textPrimary, fontWeight: "600" }} numberOfLines={1}>
                {incident.title}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                {formatRelativeTime(incident.created_at)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {incident.is_solved && (
                <Ionicons name="checkmark-circle" size={16} color="#34D399" style={{ marginRight: 6 }} />
              )}
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}
