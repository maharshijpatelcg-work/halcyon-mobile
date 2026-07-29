/**
 * Halcyon — Splash Screen
 * 
 * Official Logo Showcase on Pure Pitch Black (#000000).
 * Animation sequence: Fade In → Scale → Subtitle → Auto-navigate.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { TIMING } from '@/constants/app';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Stage 1: Logo Fade In & Scale
    logoOpacity.value = withTiming(1, { duration: 700 });
    logoScale.value = withTiming(1, { duration: 900 });

    // Stage 2: Subtitle Fade
    textOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));

    // Stage 3: Auto-navigate after ~2.5 seconds
    const timer = setTimeout(() => {
      if (!isLoading) {
        containerOpacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(navigate)();
        });
      }
    }, TIMING.SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const navigate = () => {
    if (isAuthenticated) {
      router.replace('/(app)');
    } else {
      router.replace('/(auth)/landing');
    }
  };

  const logoAnim = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnim = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [10, 0]) }],
  }));

  const containerAnim = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnim]}>
      {/* Official Full Logo */}
      <Animated.View style={logoAnim}>
        <Logo variant="full" size="xl" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary, // #000000 Pure Black
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
});
