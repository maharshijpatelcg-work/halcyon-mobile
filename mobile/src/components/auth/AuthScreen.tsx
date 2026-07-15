import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "../../providers/LanguageProvider";
import { useTheme } from "../../providers/ThemeProvider";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";
import { Logo } from "../ui/Logo";

export function AuthScreen() {
  const { login, signup } = useAuth();
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePickPhoto = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setAvatar(res.assets[0].uri);
      }
    } catch (err) {
      console.error("Error picking photo: ", err);
    }
  };

  const handleSubmit = async () => {
    setError("");
    
    // Client-side validations
    if (!email.trim() || !password.trim()) {
      setError(t("fillAll"));
      return;
    }
    if (isSignUp && !name.trim()) {
      setError(t("enterName"));
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError(t("passwordsDontMatch"));
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signup(name.trim(), email.trim(), password, avatar);
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{ marginBottom: 16 }}>
            <Logo size={72} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: "800", color: colors.textPrimary, marginBottom: 8, textAlign: "center" }}>
            HALCYON
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center" }}>
            {t("incidentAgent")}
          </Text>
        </View>

        <GlassCard accentColor="#6366F1">
          {/* Segmented Control Switch */}
          <View style={{ 
            flexDirection: "row", 
            backgroundColor: isDark ? "#12121A" : "#F3F4F6", 
            borderRadius: 14, 
            padding: 4, 
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.borderSubtle
          }}>
            <Pressable
              onPress={() => { setIsSignUp(true); setError(""); }}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                borderRadius: 10,
                backgroundColor: isSignUp ? "#6366F1" : "transparent"
              }}
            >
              <Text style={{ 
                fontSize: 13, 
                fontWeight: "700", 
                color: isSignUp ? "#FFFFFF" : colors.textSecondary 
              }}>
                {t("signUp")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => { setIsSignUp(false); setError(""); }}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                borderRadius: 10,
                backgroundColor: !isSignUp ? "#6366F1" : "transparent"
              }}
            >
              <Text style={{ 
                fontSize: 13, 
                fontWeight: "700", 
                color: !isSignUp ? "#FFFFFF" : colors.textSecondary 
              }}>
                {t("signIn")}
              </Text>
            </Pressable>
          </View>

          {error ? (
            <View style={{ backgroundColor: "rgba(239, 68, 68, 0.12)", borderColor: "rgba(239, 68, 68, 0.2)", borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <Text style={{ color: "#EF4444", fontSize: 13, textAlign: "center" }}>{error}</Text>
            </View>
          ) : null}

          {isSignUp && (
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Pressable 
                onPress={handlePickPhoto}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }]
                })}
              >
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: isDark ? "#12121A" : "#E5E7EB",
                  borderWidth: 1.5,
                  borderColor: avatar ? "#6366F1" : colors.borderSubtle,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={{ width: "100%", height: "100%" }} />
                  ) : (
                    <Ionicons name="camera-outline" size={26} color={colors.textSecondary} />
                  )}
                </View>
              </Pressable>
              <Pressable onPress={handlePickPhoto} style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#818CF8" }}>
                  {t("importPhoto")}
                </Text>
              </Pressable>
            </View>
          )}

          {isSignUp && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                {t("fullName")}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter Your Name"
                placeholderTextColor={colors.textMuted}
                style={{
                  fontSize: 14, color: colors.textPrimary,
                  backgroundColor: isDark ? "#12121A" : "#F5F5F8", padding: 14,
                  borderRadius: 12, borderWidth: 1, borderColor: colors.borderSubtle,
                }}
              />
            </View>
          )}

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              {t("emailAddress")}
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter Your Email"
              placeholderTextColor={colors.textMuted}
              style={{
                fontSize: 14, color: colors.textPrimary,
                backgroundColor: isDark ? "#12121A" : "#F5F5F8", padding: 14,
                borderRadius: 12, borderWidth: 1, borderColor: colors.borderSubtle,
              }}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              {t("password")}
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              style={{
                fontSize: 14, color: colors.textPrimary,
                backgroundColor: isDark ? "#12121A" : "#F5F5F8", padding: 14,
                borderRadius: 12, borderWidth: 1, borderColor: colors.borderSubtle,
              }}
            />
          </View>

          {isSignUp && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                {t("confirmPassword")}
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                style={{
                  fontSize: 14, color: colors.textPrimary,
                  backgroundColor: isDark ? "#12121A" : "#F5F5F8", padding: 14,
                  borderRadius: 12, borderWidth: 1, borderColor: colors.borderSubtle,
                }}
              />
            </View>
          )}

          <Button
            title={isSignUp ? t("signUp") : t("signIn")}
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
          />
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
