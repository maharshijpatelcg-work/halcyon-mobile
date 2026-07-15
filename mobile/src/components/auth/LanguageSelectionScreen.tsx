import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation, type Language } from "../../providers/LanguageProvider";
import { useTheme } from "../../providers/ThemeProvider";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Logo } from "../ui/Logo";

interface LangOption {
  code: Language;
  name: string;
  nativeName: string;
}

const LANGUAGES: LangOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
];

export function LanguageSelectionScreen() {
  const { language, setLanguage, setHasSelectedLanguage, t } = useTranslation();
  const { colors, isDark } = useTheme();

  const handleProceed = () => {
    setHasSelectedLanguage(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24 }}>
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <Logo size={80} />
        <Text style={{ fontSize: 24, fontWeight: "800", color: colors.textPrimary, marginTop: 16, marginBottom: 8 }}>
          Select Language
        </Text>
        <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: "center" }}>
          Choose your preferred language to continue
        </Text>
      </View>

      <View style={{ gap: 12, marginBottom: 32 }}>
        {LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <Pressable
              key={lang.code}
              onPress={() => setLanguage(lang.code)}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.99 : 1 }],
              })}
            >
              <Card
                variant={isSelected ? "elevated" : "default"}
                style={{
                  borderColor: isSelected ? "#6366F1" : colors.border,
                  borderWidth: isSelected ? 1.5 : 1,
                  backgroundColor: isSelected 
                    ? "rgba(99,102,241,0.05)" 
                    : (isDark ? "#1A1A26" : "#FFFFFF"),
                  padding: 16,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: isSelected ? colors.textPrimary : colors.textSecondary }}>
                      {lang.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                      {lang.nativeName}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#6366F1", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>✓</Text>
                    </View>
                  )}
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>

      <Button
        title="Proceed"
        onPress={handleProceed}
        fullWidth
      />
    </View>
  );
}
