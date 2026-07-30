/**
 * Halcyon — SettingsRow Component
 * 
 * Reusable settings item row (icon + title + subtitle + toggle/value/chevron).
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { ToggleSwitch } from './ToggleSwitch';

interface SettingsRowProps {
  icon?: string;
  title: string;
  subtitle?: string;
  valueText?: string;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (val: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export function SettingsRow({
  icon,
  title,
  subtitle,
  valueText,
  isToggle,
  toggleValue = false,
  onToggleChange,
  onPress,
  showChevron = true,
  destructive = false,
}: SettingsRowProps) {
  const content = (
    <View style={styles.row}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <View style={styles.textGroup}>
        <Text style={[styles.title, destructive && styles.titleDestructive]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {isToggle && onToggleChange ? (
        <ToggleSwitch value={toggleValue} onValueChange={onToggleChange} />
      ) : (
        <View style={styles.rightGroup}>
          {valueText && <Text style={styles.valueText}>{valueText}</Text>}
          {showChevron && onPress && <Text style={styles.chevron}>›</Text>}
        </View>
      )}
    </View>
  );

  if (onPress && !isToggle) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.pressable}>{content}</View>;
}

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  pressed: {
    backgroundColor: 'rgba(52, 245, 230, 0.05)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
  },
  titleDestructive: {
    color: colors.error.default,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  valueText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.primary[400],
  },
  chevron: {
    fontSize: 18,
    color: colors.text.tertiary,
  },
});
