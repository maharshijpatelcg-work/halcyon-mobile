/**
 * Halcyon — SectionHeader Component
 * 
 * Reusable mono section header with optional action button.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  actionTitle,
  onAction,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {actionTitle && onAction && (
        <Pressable style={styles.actionBtn} onPress={onAction}>
          <Text style={styles.actionText}>{actionTitle}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.primary[400],
    letterSpacing: letterSpacings.widest,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.3)',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  actionText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.primary[400],
    letterSpacing: letterSpacings.wider,
  },
});
