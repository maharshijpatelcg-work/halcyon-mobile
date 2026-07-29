/**
 * Halcyon — Password Strength Indicator
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import type { PasswordValidation } from '@/utils/validation';

interface PasswordStrengthProps {
  validation: PasswordValidation;
  visible: boolean;
}

const STRENGTH_CONFIG = {
  weak: { color: colors.error.default, label: 'WEAK', bars: 1 },
  fair: { color: colors.warning.default, label: 'FAIR', bars: 2 },
  strong: { color: colors.primary[500], label: 'STRONG', bars: 3 },
  excellent: { color: colors.primary[400], label: 'EXCELLENT', bars: 4 },
};

export function PasswordStrength({ validation, visible }: PasswordStrengthProps) {
  if (!visible) return null;

  const config = STRENGTH_CONFIG[validation.strength];

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                backgroundColor: i < config.bars ? config.color : colors.border.default,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  barsRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 4,
    marginRight: spacing.sm,
  },
  bar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  label: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    letterSpacing: letterSpacings.wider,
  },
});
