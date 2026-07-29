/**
 * Halcyon — Root Layout
 * 
 * Loads fonts via @expo-google-fonts/inter, wraps providers, manages splash screen.
 */
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AuthProvider } from '@/store/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { colors } from '@/theme/colors';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'SpaceMono-Regular': Inter_400Regular, // fallback for mono label style
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background.primary },
                  animation: 'fade',
                }}
              />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
