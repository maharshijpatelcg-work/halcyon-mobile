/**
 * Halcyon — Fully Black Gradient Background
 * 
 * Pure obsidian pitch black backdrop (#000000). Clean, zero background circles.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'hero' | 'auth';
}

export function GradientBackground({
  children,
}: GradientBackgroundProps) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary, // #000000 Pure Pitch Black
  },
});
