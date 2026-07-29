/**
 * Halcyon — Loading Spinner
 */
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePulseAnimation } from '@/hooks/usePulseAnimation';
import { colors } from '@/theme/colors';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
}

const SIZE_MAP = {
  sm: 'small' as const,
  md: 'large' as const,
  lg: 'large' as const,
};

export function LoadingSpinner({
  size = 'md',
  color = colors.primary[500],
  fullScreen = false,
}: LoadingSpinnerProps) {
  const { pulseStyle } = usePulseAnimation({
    minOpacity: 0.5,
    maxOpacity: 1,
    duration: 1500,
  });

  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <Animated.View style={pulseStyle}>
          <ActivityIndicator size={SIZE_MAP[size]} color={color} />
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.inline, pulseStyle]}>
      <ActivityIndicator size={SIZE_MAP[size]} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
  },
  inline: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
