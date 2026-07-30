/**
 * Halcyon — EmptyState Component
 * 
 * Empty state container with icon, message, and optional action button.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = '🔍',
  title,
  subtitle,
  actionTitle,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionTitle && onAction && (
        <View style={styles.buttonContainer}>
          <Button title={actionTitle} onPress={onAction} variant="cyan" size="sm" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.15)',
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.base,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: fontSizes.xs * 1.5,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
