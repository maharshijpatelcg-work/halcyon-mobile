import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../providers/ThemeProvider";
import { useTranslation } from "../../providers/LanguageProvider";

interface GitHubImportModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: (content: string, fileName: string) => void;
}

type ImportStep = "signin" | "input" | "loading" | "preview" | "error";

const GITHUB_PAT_KEY = "halcyon_github_pat";

/**
 * Converts a standard GitHub file URL to its raw content URL.
 * Supports:
 *   - https://github.com/owner/repo/blob/branch/path/file.log
 *   - https://raw.githubusercontent.com/owner/repo/branch/path/file.log
 *   - https://gist.github.com/... (raw links)
 *   - https://gist.githubusercontent.com/...
 */
function toRawGitHubUrl(url: string): string {
  const trimmed = url.trim();

  // Already a raw URL
  if (trimmed.includes("raw.githubusercontent.com")) {
    return trimmed;
  }

  // Gist raw URL
  if (trimmed.includes("gist.githubusercontent.com")) {
    return trimmed;
  }

  // Standard GitHub blob URL → raw
  const blobMatch = trimmed.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/
  );
  if (blobMatch) {
    const [, owner, repo, rest] = blobMatch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${rest}`;
  }

  // GitHub raw URL path
  const rawMatch = trimmed.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/raw\/(.+)$/
  );
  if (rawMatch) {
    const [, owner, repo, rest] = rawMatch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${rest}`;
  }

  // Gist URL → try appending /raw
  if (trimmed.includes("gist.github.com")) {
    return trimmed.endsWith("/raw") ? trimmed : `${trimmed}/raw`;
  }

  // Return as-is for other URLs
  return trimmed;
}

function extractFileName(url: string): string {
  try {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1] || "";
    // Remove query params
    const clean = lastPart.split("?")[0];
    return clean || "github-log";
  } catch {
    return "github-log";
  }
}

/**
 * Simple URL validation that works reliably across all RN platforms
 * without depending on the URL constructor (which Hermes may not support fully).
 */
function isValidUrl(text: string): boolean {
  const trimmed = text.trim();
  return /^https?:\/\/.+\..+/.test(trimmed);
}

function isGitHubUrl(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  return (
    trimmed.includes("github.com") ||
    trimmed.includes("githubusercontent.com")
  );
}

/**
 * Calculate approximate byte size of a string without relying on Blob.
 * For ASCII-heavy log files this is very close to actual byte count.
 */
function getStringByteSize(str: string): number {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 0x7f) bytes += 1;
    else if (code <= 0x7ff) bytes += 2;
    else if (code <= 0xffff) bytes += 3;
    else bytes += 4;
  }
  return bytes;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function GitHubImportModal({ visible, onClose, onImport }: GitHubImportModalProps) {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<ImportStep>("loading"); // start at loading while we check token
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [lineCount, setLineCount] = useState(0);
  const [fileSize, setFileSize] = useState("");
  const [patToken, setPatToken] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);

  // Load token on mount
  React.useEffect(() => {
    if (!visible) return;
    
    async function loadToken() {
      try {
        const storedToken = await SecureStore.getItemAsync(GITHUB_PAT_KEY);
        if (storedToken) {
          setPatToken(storedToken);
          setStep("input");
        } else {
          setStep("signin");
        }
      } catch (e) {
        console.error("Failed to load GitHub PAT", e);
        setStep("signin");
      } finally {
        setIsTokenLoaded(true);
      }
    }
    loadToken();
  }, [visible]);

  const resetState = useCallback(() => {
    setUrl("");
    setStep(patToken ? "input" : "signin");
    setError("");
    setPreview("");
    setFileName("");
    setLineCount(0);
    setFileSize("");
  }, [patToken]);

  const handleSaveToken = async () => {
    const trimmed = tempToken.trim();
    if (!trimmed) return;
    try {
      await SecureStore.setItemAsync(GITHUB_PAT_KEY, trimmed);
      setPatToken(trimmed);
      setStep("input");
      setTempToken("");
    } catch (e) {
      console.error("Failed to save token", e);
    }
  };

  const handleSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync(GITHUB_PAT_KEY);
      setPatToken("");
      setUrl("");
      setTempToken("");
      setStep("signin");
    } catch (e) {
      console.error("Failed to delete token", e);
    }
  };

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleFetch = useCallback(async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError(t("githubUrlRequired"));
      setStep("error");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError(t("githubInvalidUrl"));
      setStep("error");
      return;
    }

    if (!isGitHubUrl(trimmedUrl)) {
      setError(t("githubNotGithubUrl"));
      setStep("error");
      return;
    }

    setStep("loading");
    setError("");

    try {
      const rawUrl = toRawGitHubUrl(trimmedUrl);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      let response: Response;
      try {
        const headers: Record<string, string> = {
          "Accept": "text/plain, application/json, */*",
          "Cache-Control": "no-cache",
        };
        if (patToken) {
          headers["Authorization"] = `Bearer ${patToken}`;
        }
        
        response = await fetch(rawUrl, {
          method: "GET",
          headers,
          signal: controller.signal,
        });
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr.name === "AbortError") {
          throw new Error("Request timed out. Please check the URL and your internet connection.");
        }
        throw new Error(
          "Network error. Please check your internet connection and make sure the URL is correct."
        );
      }
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(t("githubFileNotFound"));
        } else if (response.status === 403) {
          throw new Error(t("githubRateLimited"));
        } else {
          throw new Error(`${t("githubFetchFailed")} (HTTP ${response.status})`);
        }
      }

      let content: string;
      try {
        content = await response.text();
      } catch {
        throw new Error("Failed to read the file content. The file may be binary or corrupted.");
      }

      if (!content || content.trim().length === 0) {
        throw new Error(t("githubEmptyFile"));
      }

      // Check file size (~5MB limit) using cross-platform byte calculation
      const sizeBytes = getStringByteSize(content);
      if (sizeBytes > 5 * 1024 * 1024) {
        throw new Error(t("githubFileTooLarge"));
      }

      const name = extractFileName(rawUrl);
      const lines = content.split("\n").length;

      setPreview(content);
      setFileName(name);
      setLineCount(lines);
      setFileSize(formatBytes(sizeBytes));
      setStep("preview");
    } catch (err: any) {
      console.error("[GitHubImport] Fetch error:", err);
      setError(err?.message || t("githubFetchFailed"));
      setStep("error");
    }
  }, [url, t, patToken]);

  const handleConfirmImport = useCallback(() => {
    onImport(preview, fileName);
    handleClose();
  }, [preview, fileName, onImport, handleClose]);

  const urlTrimmed = url.trim();
  const urlIsValid = urlTrimmed.length > 0 && isValidUrl(urlTrimmed);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "flex-end",
        }}
      >
        {/* Backdrop tap to dismiss */}
        <Pressable
          style={{ flex: 1 }}
          onPress={handleClose}
          accessible={false}
        />

        {/* Bottom sheet */}
        <View
          style={{
            backgroundColor: isDark ? "#12121A" : "#FFFFFF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: Platform.OS === "ios" ? 34 : 24,
            maxHeight: "85%",
            borderTopWidth: 1,
            borderColor: isDark ? "#2A2A3C" : "#E5E7EB",
          }}
        >
          {/* Handle bar */}
          <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: isDark ? "#3A3A50" : "#D1D5DB",
              }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="logo-github" size={22} color="#818CF8" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: colors.textPrimary,
                  }}
                >
                  {t("githubImportTitle")}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.textMuted,
                    marginTop: 2,
                  }}
                >
                  {t("githubImportSubtitle")}
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              {patToken ? (
                <Pressable
                  onPress={handleSignOut}
                  style={({ pressed }) => ({
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.05)",
                    borderWidth: 1,
                    borderColor: "rgba(239,68,68,0.2)",
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontSize: 11, fontWeight: "600", color: "#EF4444" }}>
                    {t("githubSignOut")}
                  </Text>
                </Pressable>
              ) : null}

              <Pressable
                onPress={handleClose}
                style={({ pressed }) => ({
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={{ paddingHorizontal: 20 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Step: Sign In */}
            {step === "signin" && (
              <View>
                <View style={{ alignItems: "center", marginBottom: 24, marginTop: 12 }}>
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 20,
                      backgroundColor: isDark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.05)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Ionicons name="key-outline" size={32} color="#6366F1" />
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginBottom: 8 }}>
                    {t("githubSignInTitle")}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textMuted, textAlign: "center", paddingHorizontal: 16, lineHeight: 20 }}>
                    {t("githubSignInDesc")}
                  </Text>
                </View>

                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: colors.textSecondary,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {t("githubTokenLabel")}
                  </Text>
                  <TextInput
                    value={tempToken}
                    onChangeText={setTempToken}
                    placeholder={t("githubTokenPlaceholder")}
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    style={{
                      backgroundColor: isDark ? "#0A0A0F" : "#F5F5F8",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isDark ? "#2A2A3C" : "#D1D5DB",
                      paddingHorizontal: 16,
                      paddingVertical: Platform.OS === "ios" ? 14 : 12,
                      fontSize: 14,
                      color: colors.textPrimary,
                    }}
                  />
                </View>

                <Pressable
                  onPress={handleSaveToken}
                  disabled={tempToken.trim().length === 0}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: tempToken.trim().length > 0
                      ? pressed
                        ? "#5558E3"
                        : "#6366F1"
                      : isDark
                        ? "#1A1A26"
                        : "#E5E7EB",
                    borderRadius: 12,
                    paddingVertical: 14,
                    opacity: tempToken.trim().length > 0 ? 1 : 0.5,
                    transform: [{ scale: pressed && tempToken.trim().length > 0 ? 0.98 : 1 }],
                  })}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={tempToken.trim().length > 0 ? "#FFFFFF" : colors.textMuted}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: tempToken.trim().length > 0 ? "#FFFFFF" : colors.textMuted,
                    }}
                  >
                    {t("githubSaveToken")}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Step: Input */}
            {step === "input" && (
              <View>
                {/* URL Input */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: colors.textSecondary,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {t("githubUrlLabel")}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: isDark ? "#0A0A0F" : "#F5F5F8",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: urlTrimmed && !isValidUrl(urlTrimmed)
                        ? "#EF4444"
                        : urlIsValid
                          ? "#6366F1"
                          : isDark
                            ? "#2A2A3C"
                            : "#D1D5DB",
                      paddingHorizontal: 12,
                    }}
                  >
                    <Ionicons
                      name="link-outline"
                      size={16}
                      color={urlIsValid ? "#6366F1" : colors.textMuted}
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      value={url}
                      onChangeText={setUrl}
                      placeholder="https://github.com/owner/repo/blob/main/logs/app.log"
                      placeholderTextColor={colors.textMuted}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      returnKeyType="go"
                      onSubmitEditing={urlIsValid ? handleFetch : undefined}
                      style={{
                        flex: 1,
                        fontSize: 13,
                        color: colors.textPrimary,
                        paddingVertical: Platform.OS === "ios" ? 14 : 12,
                      }}
                    />
                    {urlTrimmed.length > 0 && (
                      <Pressable
                        onPress={() => setUrl("")}
                        hitSlop={8}
                        style={{ padding: 4 }}
                      >
                        <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Supported URL formats */}
                <View
                  style={{
                    backgroundColor: isDark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: "#818CF8",
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {t("githubSupportedFormats")}
                  </Text>
                  {[
                    { icon: "document-text-outline" as const, text: "github.com/.../blob/.../file.log" },
                    { icon: "code-outline" as const, text: "raw.githubusercontent.com/..." },
                    { icon: "reader-outline" as const, text: "gist.github.com/user/gist-id" },
                  ].map((item, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: idx < 2 ? 6 : 0,
                      }}
                    >
                      <Ionicons
                        name={item.icon}
                        size={12}
                        color="#818CF8"
                        style={{ marginRight: 8, width: 14 }}
                      />
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.textMuted,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                        }}
                        numberOfLines={1}
                      >
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Fetch Button */}
                <Pressable
                  onPress={handleFetch}
                  disabled={!urlIsValid}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: urlIsValid
                      ? pressed
                        ? "#5558E3"
                        : "#6366F1"
                      : isDark
                        ? "#1A1A26"
                        : "#E5E7EB",
                    borderRadius: 12,
                    paddingVertical: 14,
                    opacity: urlIsValid ? 1 : 0.5,
                    transform: [{ scale: pressed && urlIsValid ? 0.98 : 1 }],
                  })}
                >
                  <Ionicons
                    name="cloud-download-outline"
                    size={18}
                    color={urlIsValid ? "#FFFFFF" : colors.textMuted}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: urlIsValid ? "#FFFFFF" : colors.textMuted,
                    }}
                  >
                    {t("githubFetchFile")}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Step: Loading */}
            {step === "loading" && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 48,
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    backgroundColor: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <ActivityIndicator size="large" color="#6366F1" />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  {isTokenLoaded ? t("githubFetching") : "Loading..."}
                </Text>
                {urlTrimmed.length > 0 && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      textAlign: "center",
                      paddingHorizontal: 20,
                    }}
                    numberOfLines={2}
                  >
                    {urlTrimmed.length > 50 ? urlTrimmed.substring(0, 50) + "..." : urlTrimmed}
                  </Text>
                )}
              </View>
            )}

            {/* Step: Preview */}
            {step === "preview" && (
              <View>
                {/* File info card */}
                <View
                  style={{
                    backgroundColor: isDark ? "#1A1A26" : "#F5F5F8",
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: isDark ? "#2A2A3C" : "#E5E7EB",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: "rgba(34,197,94,0.12)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10,
                      }}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: colors.textPrimary,
                        }}
                        numberOfLines={1}
                      >
                        {fileName}
                      </Text>
                      <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                        {t("githubFileReady")}
                      </Text>
                    </View>
                  </View>

                  {/* Stats row */}
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {[
                      { icon: "code-slash-outline" as const, label: `${lineCount} lines` },
                      { icon: "document-outline" as const, label: fileSize },
                      { icon: "logo-github" as const, label: "GitHub" },
                    ].map((stat, idx) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                          borderRadius: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 5,
                        }}
                      >
                        <Ionicons
                          name={stat.icon}
                          size={12}
                          color="#818CF8"
                          style={{ marginRight: 4 }}
                        />
                        <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: "500" }}>
                          {stat.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Preview area */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: colors.textSecondary,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {t("githubPreview")}
                  </Text>
                  <View
                    style={{
                      backgroundColor: isDark ? "#0A0A0F" : "#F0F0F5",
                      borderRadius: 12,
                      padding: 12,
                      maxHeight: 160,
                      borderWidth: 1,
                      borderColor: isDark ? "#2A2A3C" : "#D1D5DB",
                    }}
                  >
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.textSecondary,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          lineHeight: 16,
                        }}
                      >
                        {preview.substring(0, 2000)}
                        {preview.length > 2000 ? "\n\n... (content truncated in preview)" : ""}
                      </Text>
                    </ScrollView>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    onPress={() => {
                      setStep("input");
                      setPreview("");
                    }}
                    style={({ pressed }) => ({
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isDark ? "#1A1A26" : "#F0F0F5",
                      borderRadius: 12,
                      paddingVertical: 13,
                      borderWidth: 1,
                      borderColor: isDark ? "#2A2A3C" : "#D1D5DB",
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Ionicons name="arrow-back" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary }}>
                      {t("cancel")}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleConfirmImport}
                    style={({ pressed }) => ({
                      flex: 2,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: pressed ? "#16A34A" : "#22C55E",
                      borderRadius: 12,
                      paddingVertical: 13,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#FFFFFF" }}>
                      {t("githubImportBtn")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Step: Error */}
            {step === "error" && (
              <View>
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 24,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      backgroundColor: "rgba(239,68,68,0.12)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons name="alert-circle" size={28} color="#EF4444" />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.textPrimary,
                      marginBottom: 6,
                      textAlign: "center",
                    }}
                  >
                    {t("githubErrorTitle")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      textAlign: "center",
                      lineHeight: 18,
                      paddingHorizontal: 16,
                    }}
                  >
                    {error}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setStep("input")}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#6366F1",
                    borderRadius: 12,
                    paddingVertical: 14,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                >
                  <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}>
                    {t("githubTryAgain")}
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
