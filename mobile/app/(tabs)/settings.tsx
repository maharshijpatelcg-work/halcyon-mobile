import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useHealth } from "../../src/hooks/useDashboardStats";
import { useAuth } from "../../src/providers/AuthProvider";
import { useTranslation, type Language } from "../../src/providers/LanguageProvider";
import { useTheme } from "../../src/providers/ThemeProvider";
import { Card } from "../../src/components/ui/Card";
import { StatusDot } from "../../src/components/ui/StatusDot";
import { Button } from "../../src/components/ui/Button";

function SettingsRow({ icon, iconColor, label, value, rightElement }: {
  icon: keyof typeof Ionicons.glyphMap; iconColor: string; label: string; value: string; rightElement?: React.ReactNode;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(42,42,60,0.3)" }}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: iconColor + "18", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>
        <Text style={{ fontSize: 14, color: "#F1F1F4", fontWeight: "500" }} numberOfLines={1}>{label}</Text>
      </View>
      {rightElement ?? <Text style={{ fontSize: 12, color: "#9CA3AF", fontWeight: "500" }} numberOfLines={1}>{value}</Text>}
    </View>
  );
}

export default function SettingsScreen() {
  const { data: health } = useHealth();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();

  const apiStatus = health?.status === "ok" ? "online" : "offline";
  const dbStatus = health?.db === "ok" ? "online" : "offline";
  const memStatus = health?.memory === "ok" ? "online" : health?.memory === "disabled" ? "warning" : "offline";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Title */}
        <Animated.View entering={FadeInDown.springify().damping(18)} style={{ marginBottom: 20, paddingTop: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textPrimary }}>{t("settings")}</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Configuration & profile controls</Text>
            </View>
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
          </View>
        </Animated.View>

        {/* User Profile Card */}
        {user && (
          <Animated.View entering={FadeInDown.delay(50).springify().damping(18)} style={{ marginBottom: 20 }}>
            <Card variant="elevated">
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <Image
                  source={{ uri: user.avatar }}
                  style={{ width: 56, height: 56, borderRadius: 28, marginRight: 16, borderWidth: 1.5, borderColor: "#6366F1" }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary }} numberOfLines={1}>{user.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }} numberOfLines={1}>{user.email}</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                    <View style={{ backgroundColor: "rgba(99,102,241,0.15)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 10, color: "#818CF8", fontWeight: "700" }}>{user.role}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Button
                title={t("signOut")}
                onPress={logout}
                variant="danger"
                style={{ paddingVertical: 10 }}
                icon={<Ionicons name="log-out-outline" size={16} color="#EF4444" />}
              />
            </Card>
          </Animated.View>
        )}

        {/* Language Selection Card */}
        <Animated.View entering={FadeInDown.delay(100).springify().damping(18)} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, paddingHorizontal: 4 }}>
            {t("language")}
          </Text>
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(99,102,241,0.15)", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Ionicons name="globe-outline" size={16} color="#6366F1" />
                </View>
                <Text style={{ fontSize: 14, color: colors.textPrimary, fontWeight: "500" }}>{t("language")}</Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {(["en", "es", "hi", "gu"] as Language[]).map((lang) => (
                  <Pressable
                    key={lang}
                    onPress={() => setLanguage(lang)}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 8,
                      borderWidth: 1,
                      backgroundColor: language === lang ? "#6366F1" : isDark ? "#12121A" : "#F0F0F5",
                      borderColor: language === lang ? "#6366F1" : colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "700", color: language === lang ? "#fff" : colors.textSecondary, textTransform: "uppercase" }}>
                      {lang}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* System Health */}
        <Animated.View entering={FadeInDown.delay(140).springify().damping(18)} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, paddingHorizontal: 4 }}>
            {t("systemHealth")}
          </Text>
          <Card>
            <SettingsRow icon="server-outline" iconColor="#6366F1" label={t("apiServer")} value=""
              rightElement={<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><Text style={{ fontSize: 12, color: "#9CA3AF", textTransform: "capitalize" }}>{apiStatus}</Text><StatusDot status={apiStatus as any} size={7} /></View>} />
            <SettingsRow icon="server-outline" iconColor="#34D399" label={t("database")} value=""
              rightElement={<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><Text style={{ fontSize: 12, color: "#9CA3AF", textTransform: "capitalize" }}>{dbStatus}</Text><StatusDot status={dbStatus as any} size={7} /></View>} />
            <SettingsRow icon="hardware-chip-outline" iconColor="#FBBF24" label={t("hindsightMemory")} value=""
              rightElement={<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><Text style={{ fontSize: 12, color: "#9CA3AF", textTransform: "capitalize" }}>{memStatus}</Text><StatusDot status={memStatus as any} size={7} /></View>} />
          </Card>
        </Animated.View>

        {/* Connection */}
        <Animated.View entering={FadeInDown.delay(180).springify().damping(18)} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, paddingHorizontal: 4 }}>
            {t("connection")}
          </Text>
          <Card>
            <SettingsRow icon="link-outline" iconColor="#818CF8" label={t("apiBaseUrl")} value="127.0.0.1:8000" />
            <SettingsRow icon="git-branch-outline" iconColor="#F97316" label={t("apiVersion")} value={health?.version ?? "—"} />
            <SettingsRow icon="swap-horizontal-outline" iconColor="#34D399" label={t("dataMode")} value="Mock Fallback" />
          </Card>
        </Animated.View>

        {/* AI Engine */}
        <Animated.View entering={FadeInDown.delay(220).springify().damping(18)} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, paddingHorizontal: 4 }}>{t("aiEngine")}</Text>
          <Card>
            <SettingsRow icon="flash-outline" iconColor="#6366F1" label={t("draftModel")} value="llama-3.1-8b" />
            <SettingsRow icon="shield-checkmark-outline" iconColor="#F97316" label={t("verifierModel")} value="llama-3.3-70b" />
            <SettingsRow icon="lock-closed-outline" iconColor="#EF4444" label={t("complianceModel")} value="llama-guard-3-8b" />
            <SettingsRow icon="git-compare-outline" iconColor="#34D399" label={t("cascadeflow")} value="Enabled" />
          </Card>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInDown.delay(260).springify().damping(18)}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, paddingHorizontal: 4 }}>
            {t("about")}
          </Text>
          <Card>
            <SettingsRow icon="shield-outline" iconColor="#6366F1" label="HALCYON" value="v1.0.0" />
            <SettingsRow icon="code-slash-outline" iconColor="#9CA3AF" label={t("backend")} value="Sentinel FastAPI" />
            <SettingsRow icon="logo-github" iconColor="#6B7280" label={t("sourceCode")} value="" rightElement={<Ionicons name="open-outline" size={14} color="#6B7280" />} />
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
