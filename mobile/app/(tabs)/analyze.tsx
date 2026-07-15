import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSubmitAnalysis } from "../../src/hooks/useAnalysis";
import { LogInput } from "../../src/components/analyze/LogInput";
import { AnalyzingAnimation } from "../../src/components/analyze/AnalyzingAnimation";
import { ResultView } from "../../src/components/analyze/ResultView";
import { GitHubImportModal } from "../../src/components/analyze/GitHubImportModal";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { MOCK_SAMPLES } from "../../src/services/mockData";
import type { IncidentSubmitResponse } from "../../src/types";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useTranslation } from "../../src/providers/LanguageProvider";
import { useTheme } from "../../src/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";

export default function AnalyzeScreen() {
  const { t } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();
  const [logContent, setLogContent] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [result, setResult] = useState<IncidentSubmitResponse | null>(null);
  const [githubModalVisible, setGithubModalVisible] = useState(false);
  const submitMutation = useSubmitAnalysis();

  const handlePickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["text/*", "application/json", "text/plain"],
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) {
        return;
      }

      const asset = res.assets[0];
      let fileContent = "";

      if (Platform.OS === "web") {
        const fileBlob = asset.file;
        if (fileBlob) {
          fileContent = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string || "");
            reader.onerror = (e) => reject(e);
            reader.readAsText(fileBlob);
          });
        }
      } else {
        fileContent = await FileSystem.readAsStringAsync(asset.uri);
      }

      if (fileContent) {
        setLogContent(fileContent);
        const cleanName = asset.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setAlertTitle(title);
        
        // Auto-run analysis instantly
        const response = await submitMutation.mutateAsync({
          alert_title: title,
          log_content: fileContent,
        });
        setResult(response);
      }
    } catch (err) {
      console.error("Error reading file: ", err);
    }
  };

  const handleSubmit = async () => {
    if (!logContent.trim()) return;
    const response = await submitMutation.mutateAsync({
      alert_title: alertTitle.trim() || "Untitled Incident",
      log_content: logContent.trim(),
    });
    setResult(response);
  };

  const handleLoadSample = (name: string) => {
    setAlertTitle(name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
    setLogContent(
      `[2026-07-10 08:15:32] ERROR ${name}\n` +
      `[2026-07-10 08:15:32] CRITICAL Service degradation detected\n` +
      `[2026-07-10 08:15:33] WARN Connection pool usage: 95%\n` +
      `[2026-07-10 08:15:33] ERROR PostgreSQL connection timeout after 30s\n` +
      `[2026-07-10 08:15:34] FATAL Unable to acquire database connection\n` +
      `[2026-07-10 08:15:34] ERROR payment-service health check failed\n` +
      `[2026-07-10 08:15:35] WARN Retry attempt 3/5 for transaction processing\n` +
      `[2026-07-10 08:15:35] ERROR Request timeout on /api/v1/payments\n` +
      `[2026-07-10 08:15:36] CRITICAL Cascading failure across 3 services`,
    );
  };

  const handleGitHubImport = async (content: string, fileName: string) => {
    setLogContent(content);
    const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    setAlertTitle(title);

    // Auto-run analysis instantly
    try {
      const response = await submitMutation.mutateAsync({
        alert_title: title,
        log_content: content,
      });
      setResult(response);
    } catch (err) {
      console.error("Error running analysis on GitHub import: ", err);
    }
  };

  const handleReset = () => { setResult(null); setLogContent(""); setAlertTitle(""); };

  if (submitMutation.isPending) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <AnalyzingAnimation />
      </SafeAreaView>
    );
  }

  if (result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textPrimary }}>Analysis Complete</Text>
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
        <ResultView response={result} onReset={handleReset} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <Animated.View entering={FadeInDown.springify().damping(18)} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textPrimary, marginBottom: 4 }}>{t("newAnalysis")}</Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>{t("submitLogs")}</Text>
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

          {/* Title Input */}
          <Animated.View entering={FadeInDown.delay(50).springify().damping(18)} style={{ marginBottom: 16 }}>
            <Card>
              <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                {t("alertTitle")}
              </Text>
              <TextInput
                value={alertTitle}
                onChangeText={setAlertTitle}
                placeholder="e.g., Database Connection Timeout"
                placeholderTextColor={colors.textMuted}
                style={{
                  fontSize: 14, color: colors.textPrimary,
                  backgroundColor: isDark ? "#12121A" : "#F5F5F8", padding: 12,
                  borderRadius: 10, borderWidth: 1, borderColor: colors.borderSubtle,
                }}
              />
            </Card>
          </Animated.View>

          {/* Import Buttons Row */}
          <Animated.View entering={FadeInDown.delay(75).springify().damping(18)} style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            {/* Local File Import Button */}
            <Pressable
              onPress={handlePickFile}
              style={({ pressed }) => ({
                width: 120,
                height: 120,
                borderRadius: 20,
                backgroundColor: pressed ? (isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)") : (isDark ? "#1A1A26" : "#FFFFFF"),
                borderColor: "#6366F1",
                borderWidth: 1.5,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#6366F1",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.08 : 0.04,
                shadowRadius: 10,
                elevation: 3,
                transform: [{ scale: pressed ? 0.96 : 1 }]
              })}
            >
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: "rgba(99,102,241,0.1)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}>
                <Ionicons name="cloud-upload-outline" size={22} color="#818CF8" />
              </View>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textPrimary, textAlign: "center", paddingHorizontal: 8 }}>
                {t("importLogFile")}
              </Text>
            </Pressable>

            {/* GitHub Import Button */}
            <Pressable
              onPress={() => setGithubModalVisible(true)}
              style={({ pressed }) => ({
                width: 120,
                height: 120,
                borderRadius: 20,
                backgroundColor: pressed ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(36,41,47,0.08)") : (isDark ? "#1A1A26" : "#FFFFFF"),
                borderColor: isDark ? "#3A3A50" : "#D1D5DB",
                borderWidth: 1.5,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: isDark ? "#000" : "#6B7280",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.12 : 0.06,
                shadowRadius: 10,
                elevation: 3,
                transform: [{ scale: pressed ? 0.96 : 1 }]
              })}
            >
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(36,41,47,0.06)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}>
                <Ionicons name="logo-github" size={22} color={isDark ? "#E5E7EB" : "#24292F"} />
              </View>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textPrimary, textAlign: "center", paddingHorizontal: 8 }}>
                {t("importFromGithub")}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Log Input */}
          <Animated.View entering={FadeInDown.delay(100).springify().damping(18)} style={{ marginBottom: 20 }}>
            <LogInput value={logContent} onChangeText={setLogContent} />
          </Animated.View>

          {/* Sample Scenarios */}
          <Animated.View entering={FadeInDown.delay(150).springify().damping(18)} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, paddingHorizontal: 4 }}>
              Quick Load — Demo Scenarios
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {MOCK_SAMPLES.map((s) => (
                <Pressable
                  key={s.name}
                  onPress={() => handleLoadSample(s.name)}
                  style={{
                    backgroundColor: isDark ? "#1A1A26" : "#FFFFFF", borderWidth: 1, borderColor: colors.border,
                    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
                    flexDirection: "row", alignItems: "center",
                  }}
                >
                  <Ionicons name="document-text-outline" size={14} color="#818CF8" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "500" }} numberOfLines={1}>
                    {s.name.replace(/-/g, " ")}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Submit */}
          <Animated.View entering={FadeInDown.delay(200).springify().damping(18)}>
            <Button
              title={t("runAnalysis")}
              onPress={handleSubmit}
              disabled={!logContent.trim()}
              loading={submitMutation.isPending}
              icon={<Ionicons name="flash" size={16} color="#fff" />}
              fullWidth
            />
          </Animated.View>

          {submitMutation.isError && (
            <Animated.View entering={FadeInDown.springify()} style={{ marginTop: 16 }}>
              <Card>
                <Text style={{ fontSize: 12, color: "#EF4444", fontWeight: "500" }}>
                  Analysis failed. Please try again or check your connection.
                </Text>
              </Card>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* GitHub Import Modal */}
      <GitHubImportModal
        visible={githubModalVisible}
        onClose={() => setGithubModalVisible(false)}
        onImport={handleGitHubImport}
      />
    </SafeAreaView>
  );
}
