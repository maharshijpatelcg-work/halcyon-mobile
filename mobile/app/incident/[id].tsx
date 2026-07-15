import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useIncidentDetail } from "../../src/hooks/useIncidents";
import { useResolveIncident } from "../../src/hooks/useAnalysis";
import { AnalysisResult } from "../../src/components/incidents/AnalysisResult";
import { SeverityBadge } from "../../src/components/ui/SeverityBadge";
import { Badge } from "../../src/components/ui/Badge";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { SkeletonCard } from "../../src/components/ui/SkeletonLoader";
import { formatDateTime } from "../../src/utils/formatters";
import { useTheme } from "../../src/providers/ThemeProvider";

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const incidentId = Number(id);
  const { data: incident, isLoading } = useIncidentDetail(incidentId);
  const resolveMutation = useResolveIncident();
  const [showResolve, setShowResolve] = useState(false);
  const [solution, setSolution] = useState("");
  const { colors, isDark } = useTheme();

  const handleResolve = async () => {
    if (!solution.trim()) return;
    await resolveMutation.mutateAsync({ incident_id: incidentId, solution: solution.trim() });
    setShowResolve(false);
    setSolution("");
  };

  if (isLoading || !incident) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <Pressable onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: isDark ? "#1A1A26" : "#FFFFFF", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
            <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
          </Pressable>
          <View style={{ backgroundColor: colors.border, borderRadius: 6, width: 160, height: 20 }} />
        </View>
        <View style={{ padding: 16 }}><SkeletonCard /><SkeletonCard /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.springify().damping(18)}
        style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }}>
        <Pressable onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: isDark ? "#1A1A26" : "#FFFFFF", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: colors.textPrimary }} numberOfLines={1}>Incident #{incident.id}</Text>
          <Text style={{ fontSize: 11, color: colors.textMuted }}>{formatDateTime(incident.created_at)}</Text>
        </View>
        <SeverityBadge severity={incident.severity} size="sm" />
      </Animated.View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Title & Status */}
        <Animated.View entering={FadeInDown.delay(50).springify().damping(18)} style={{ marginBottom: 16 }}>
          <Card>
            <Text style={{ fontSize: 16, fontWeight: "800", color: colors.textPrimary, marginBottom: 8 }}>{incident.title}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 20, marginBottom: 12 }}>{incident.summary || "No summary available."}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              {incident.is_solved ? <Badge label="Resolved" variant="success" /> : <Badge label="Open" variant="warning" />}
              {incident.tags.map((t: string) => <Badge key={t} label={t} variant="muted" />)}
            </View>
            {incident.is_solved && incident.solution && (
              <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.borderSubtle }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#34D399", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Resolution</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>{incident.solution}</Text>
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Confidence */}
        {incident.confidence_score !== null && (
          <Animated.View entering={FadeInDown.delay(100).springify().damping(18)} style={{ marginBottom: 16 }}>
            <Card>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="analytics-outline" size={16} color="#818CF8" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "500" }}>AI Confidence</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ width: 96, height: 8, backgroundColor: isDark ? "#12121A" : "#E5E7EB", borderRadius: 4, overflow: "hidden", marginRight: 8 }}>
                    <View style={{ height: "100%", borderRadius: 4, backgroundColor: "#6366F1", width: `${(incident.confidence_score ?? 0) * 100}%` }} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: "800", color: colors.textPrimary }}>{((incident.confidence_score ?? 0) * 100).toFixed(0)}%</Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Analysis */}
        {incident.root_cause && incident.fix_suggestion && (
          <Animated.View entering={FadeInDown.delay(150).springify().damping(18)} style={{ marginBottom: 16 }}>
            <AnalysisResult analysis={{
              root_cause: incident.root_cause,
              severity: incident.severity ?? "MEDIUM",
              fix_suggestion: incident.fix_suggestion,
              summary: incident.summary ?? "",
              affected_components: incident.affected_components ?? [],
              confidence_score: incident.confidence_score ?? 0,
            }} />
          </Animated.View>
        )}

        {/* Log Preview */}
        <Animated.View entering={FadeInDown.delay(200).springify().damping(18)} style={{ marginBottom: 16 }}>
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Ionicons name="code-slash-outline" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase" }}>Raw Log Preview</Text>
            </View>
            <View style={{ backgroundColor: isDark ? "#12121A" : "#F3F4F6", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.borderSubtle }}>
              <Text style={{ fontSize: 10, fontFamily: "monospace", color: colors.textMuted, lineHeight: 16 }} numberOfLines={12}>
                {incident.log_content}
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Resolve */}
        {!incident.is_solved && (
          <Animated.View entering={FadeInDown.delay(250).springify().damping(18)}>
            {showResolve ? (
              <Card>
                <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Document Resolution</Text>
                <TextInput
                  multiline numberOfLines={4} value={solution} onChangeText={setSolution}
                  placeholder="Describe how this incident was resolved..."
                  placeholderTextColor={colors.textMuted}
                  style={{ fontSize: 12, color: colors.textPrimary, backgroundColor: isDark ? "#12121A" : "#F3F4F6", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.borderSubtle, minHeight: 100, textAlignVertical: "top", marginBottom: 12 }}
                />
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Button title="Cancel" onPress={() => { setShowResolve(false); setSolution(""); }} variant="ghost" style={{ flex: 1 }} />
                  <Button title="Mark Resolved" onPress={handleResolve} loading={resolveMutation.isPending} disabled={!solution.trim()}
                    icon={<Ionicons name="checkmark-circle" size={16} color="#fff" />} style={{ flex: 1 }} />
                </View>
              </Card>
            ) : (
              <Button title="Resolve Incident" onPress={() => setShowResolve(true)} icon={<Ionicons name="checkmark-circle-outline" size={16} color="#fff" />} fullWidth />
            )}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
