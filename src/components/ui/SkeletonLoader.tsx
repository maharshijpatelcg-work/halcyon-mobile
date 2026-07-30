/**
 * Halcyon — SkeletonLoader Component
 * 
 * Shimmer placeholder loader matching pure pitch black theme.
 */
import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { borderRadius } from '@/theme/spacing';

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius: radius = borderRadius.sm,
  style,
}: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius: radius },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#1A1A1A',
    borderColor: '#2A2A2A',
    borderWidth: 1,
  },
});
