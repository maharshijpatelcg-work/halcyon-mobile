import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../ui/Card";
import { SeverityBadge } from "../ui/SeverityBadge";
import { Badge } from "../ui/Badge";
import { formatRelativeTime } from "../../utils/formatters";
import { useTheme } from "../../providers/ThemeProvider";
import type { Incident } from "../../types";

interface IncidentCardProps {
  incident: Incident;
  onPress: () => void;
}

export function IncidentCard({ incident, onPress }: IncidentCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <Pressable onPress={onPress} style={{ marginBottom: 12 }}>
      <Card>
        {/* Header: severity + time */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <SeverityBadge severity={incident.severity} size="sm" />
          <Text style={{ fontSize: 11, color: colors.textMuted }}>
            {formatRelativeTime(incident.created_at)}
          </Text>
        </View>

        {/* Title */}
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginBottom: 6 }} numberOfLines={1}>
          {incident.title}
        </Text>

        {/* Summary */}
        <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12, lineHeight: 18 }} numberOfLines={2}>
          {incident.summary || "No summary provided by the AI response agent."}
        </Text>

        {/* Footer: tags + status */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, flex: 1 }}>
            {incident.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} label={tag} variant="muted" />
            ))}
            {incident.tags.length > 2 && (
              <Badge label={`+${incident.tags.length - 2}`} variant="muted" />
            )}
          </View>

          {incident.is_solved ? (
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(52,211,153,0.12)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Ionicons name="checkmark-circle" size={12} color="#34D399" style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 10, color: "#34D399", fontWeight: "600" }}>Solved</Text>
            </View>
          ) : (
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              backgroundColor: isDark ? "#12121A" : "#F3F4F6", 
              paddingHorizontal: 8, 
              paddingVertical: 3, 
              borderRadius: 6, 
              borderWidth: 1, 
              borderColor: colors.border 
            }}>
              <Ionicons name="alert-circle-outline" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: "600" }}>Open</Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
}
