import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/providers/AuthProvider";
import { useTranslation } from "../../src/providers/LanguageProvider";
import { useTheme } from "../../src/providers/ThemeProvider";
import { Card } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";

const PREMIUM_FEATURES = [
  { icon: "analytics-outline" as const, label: "Unlimited Log Analysis", desc: "No cap on daily log submissions" },
  { icon: "shield-checkmark-outline" as const, label: "Advanced Verification", desc: "70B parameter verification model" },
  { icon: "hardware-chip-outline" as const, label: "Hindsight Memory Cache", desc: "Guaranteed memory cache hits" },
  { icon: "flash-outline" as const, label: "Priority Processing", desc: "2x faster incident analysis" },
  { icon: "people-outline" as const, label: "Team Collaboration", desc: "Share incidents with your team" },
  { icon: "document-text-outline" as const, label: "Export Reports", desc: "PDF & CSV export capabilities" },
];

export default function AccountScreen() {
  const { user, upgradeToPremium } = useAuth();
  const { t } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upgradeError, setUpgradeError] = useState("");
  const [isUpgrading, setIsUpgrading] = useState(false);

  const isPremium = user?.plan === "premium";

  const handleConfirmUpgrade = async () => {
    setUpgradeError("");
    if (!cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
      setUpgradeError("Please fill in all credit card details.");
      return;
    }

    setIsUpgrading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsUpgrading(false);

    upgradeToPremium();
    setShowUpgradeModal(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Animated.View entering={FadeInDown.springify().damping(18)} style={{ marginBottom: 24, paddingTop: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textPrimary }}>{t("accountTitle")}</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{t("accountSubtitle")}</Text>
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

        {/* User Profile + Plan Card */}
        {user && (
          <Animated.View entering={FadeInDown.delay(50).springify().damping(18)} style={{ marginBottom: 24 }}>
            <Card variant="elevated">
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <Image
                  source={{ uri: user.avatar }}
                  style={{ width: 56, height: 56, borderRadius: 28, marginRight: 16, borderWidth: 1.5, borderColor: isPremium ? "#8B5CF6" : "#6366F1" }}
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

              {/* Current Plan Display */}
              <View style={{
                backgroundColor: isPremium ? "rgba(139,92,246,0.1)" : isDark ? "rgba(42,42,60,0.3)" : "rgba(0,0,0,0.04)",
                borderWidth: 1,
                borderColor: isPremium ? "rgba(139,92,246,0.3)" : colors.borderSubtle,
                borderRadius: 12,
                padding: 16,
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{
                      width: 40, height: 40, borderRadius: 12,
                      backgroundColor: isPremium ? "rgba(139,92,246,0.2)" : "rgba(99,102,241,0.15)",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <Ionicons name={isPremium ? "diamond" : "cube-outline"} size={20} color={isPremium ? "#A78BFA" : "#6366F1"} />
                    </View>
                    <View>
                      <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                        {t("currentPlanLabel")}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "800", color: isPremium ? "#A78BFA" : colors.textPrimary, marginTop: 2 }}>
                        {isPremium ? t("premiumPlan") : t("freePlan")}
                      </Text>
                    </View>
                  </View>
                  {isPremium && (
                    <View style={{ backgroundColor: "rgba(139,92,246,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ fontSize: 10, fontWeight: "800", color: "#C084FC", textTransform: "uppercase" }}>Active</Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Premium Features */}
        <Animated.View entering={FadeInDown.delay(100).springify().damping(18)} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, paddingHorizontal: 4 }}>
            {t("features")}
          </Text>
          <Card>
            {PREMIUM_FEATURES.map((feature, index) => (
              <View
                key={feature.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: index < PREMIUM_FEATURES.length - 1 ? 1 : 0,
                  borderBottomColor: colors.borderSubtle,
                }}
              >
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: isPremium ? "rgba(139,92,246,0.12)" : "rgba(99,102,241,0.1)",
                  alignItems: "center", justifyContent: "center", marginRight: 12,
                }}>
                  <Ionicons name={feature.icon} size={18} color={isPremium ? "#A78BFA" : "#6366F1"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textPrimary }}>{feature.label}</Text>
                  <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>{feature.desc}</Text>
                </View>
                {isPremium ? (
                  <Ionicons name="checkmark-circle" size={20} color="#34D399" />
                ) : (
                  <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
                )}
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Upgrade Button (only for free users) */}
        {!isPremium && (
          <Animated.View entering={FadeInUp.delay(200).springify().damping(18)} style={{ marginBottom: 24 }}>
            <Pressable
              onPress={() => setShowUpgradeModal(true)}
              style={({ pressed }) => ({
                borderRadius: 14,
                overflow: "hidden",
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View style={{
                backgroundColor: "#8B5CF6",
                padding: 18,
                borderRadius: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                shadowColor: "#8B5CF6",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 8,
              }}>
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff" }}>{t("upgradeBtn")}</Text>
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Premium Active Banner (for premium users) */}
        {isPremium && (
          <Animated.View entering={FadeInUp.delay(200).springify().damping(18)} style={{ marginBottom: 24 }}>
            <View style={{
              backgroundColor: "rgba(52,211,153,0.1)",
              borderWidth: 1,
              borderColor: "rgba(52,211,153,0.25)",
              borderRadius: 14,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(52,211,153,0.15)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="checkmark-done" size={22} color="#34D399" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#34D399" }}>{t("successUpgrade")}</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>All premium features are unlocked.</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Upgrade Checkout Modal */}
      {showUpgradeModal && (
        <Modal visible={showUpgradeModal} animationType="slide" transparent>
          <View style={{ flex: 1, backgroundColor: colors.cardOverlay, justifyContent: "center", padding: 20 }}>
            <View style={{ backgroundColor: isDark ? "#1A1A26" : "#FFFFFF", borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 24 }}>
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(139,92,246,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Ionicons name="sparkles" size={24} color="#8B5CF6" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "800", color: colors.textPrimary }}>{t("upgradeTitle")}</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: "center", marginTop: 6, lineHeight: 18 }}>
                  {t("upgradeDesc")}
                </Text>
              </View>

              {upgradeError ? (
                <View style={{ backgroundColor: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.2)", borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 16 }}>
                  <Text style={{ color: "#EF4444", fontSize: 12, textAlign: "center" }}>{upgradeError}</Text>
                </View>
              ) : null}

              {/* Simulated Payment Form */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Card Number</Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="4242 •••• •••• 4242"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  style={{ fontSize: 14, color: colors.textPrimary, backgroundColor: isDark ? "#12121A" : "#F5F5F8", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.borderSubtle }}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Expiry</Text>
                  <TextInput
                    value={expiry}
                    onChangeText={setExpiry}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textMuted}
                    style={{ fontSize: 14, color: colors.textPrimary, backgroundColor: isDark ? "#12121A" : "#F5F5F8", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.borderSubtle }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>CVV</Text>
                  <TextInput
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="123"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    secureTextEntry
                    style={{ fontSize: 14, color: colors.textPrimary, backgroundColor: isDark ? "#12121A" : "#F5F5F8", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.borderSubtle }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <Button
                  title={t("cancel")}
                  onPress={() => { setShowUpgradeModal(false); setUpgradeError(""); }}
                  variant="ghost"
                  style={{ flex: 1 }}
                />
                <Button
                  title={t("confirmUpgrade")}
                  onPress={handleConfirmUpgrade}
                  loading={isUpgrading}
                  style={{ flex: 1, backgroundColor: "#8B5CF6" }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
