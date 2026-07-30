/**
 * Halcyon — SearchBar Component
 * 
 * Liquid Cyan bordered search input with debounced callback.
 */
import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search incidents, vectors, logs...',
  onClear,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable onPress={() => { onChangeText(''); onClear?.(); }} hitSlop={8}>
          <Text style={styles.clearIcon}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.25)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: spacing.xs + 2,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 12,
    color: colors.text.tertiary,
    paddingLeft: spacing.xs,
  },
});
