/**
 * Halcyon — Divider Component
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface DividerProps {
  text?: string;
}

export function Divider({ text }: DividerProps) {
  if (!text) {
    return <View style={styles.line} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  text: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
    textTransform: 'uppercase',
    marginHorizontal: spacing.base,
  },
});
