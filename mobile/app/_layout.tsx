import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { QueryProvider } from "../src/providers/QueryProvider";
import { AuthProvider, useAuth } from "../src/providers/AuthProvider";
import { LanguageProvider } from "../src/providers/LanguageProvider";
import { ThemeProvider, useTheme } from "../src/providers/ThemeProvider";
import { AuthScreen } from "../src/components/auth/AuthScreen";

import "../global.css";

SplashScreen.preventAutoHideAsync();

import { LanguageSelectionScreen } from "../src/components/auth/LanguageSelectionScreen";
import { useTranslation } from "../src/providers/LanguageProvider";
import { SplashView } from "../src/components/ui/SplashView";

function NavigationStack() {
  const { isAuthenticated } = useAuth();
  const { hasSelectedLanguage } = useTranslation();
  const { colors, isDark } = useTheme();
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashView onFinish={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (!hasSelectedLanguage) {
    return <LanguageSelectionScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    />
  );
}

function ThemedRootView() {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <NavigationStack />
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ThemedRootView />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}
