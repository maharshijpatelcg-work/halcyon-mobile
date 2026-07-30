/**
 * Halcyon — ErrorState Component
 * 
 * Reusable error state screen with retry button.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Failed to load data. Please check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <View style={styles.btnWrap}>
          <Button title="RETRY" onPress={onRetry} variant="outline" size="sm" />
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
    borderColor: 'rgba(255, 100, 120, 0.3)',
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
    color: colors.error.default,
    textAlign: 'center',
    marginBottom: 4,
  },
  message: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: fontSizes.xs * 1.5,
  },
  btnWrap: {
    marginTop: spacing.md,
  },
});
