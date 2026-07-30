/**
 * Halcyon — FilterChips Component
 * 
 * Scrollable chip filter row for severity, status, categories.
 */
import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function FilterChips({ options, selectedId, onSelect }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((opt) => {
        const isSelected = opt.id === selectedId;
        return (
          <Pressable
            key={opt.id}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelect(opt.id)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {opt.label}
            </Text>
            {opt.count !== undefined && (
              <View style={[styles.countBadge, isSelected && styles.countBadgeSelected]}>
                <Text style={[styles.countText, isSelected && styles.countTextSelected]}>
                  {opt.count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  chipSelected: {
    backgroundColor: 'rgba(52, 245, 230, 0.1)',
    borderColor: colors.primary[400],
  },
  chipText: {
    fontFamily: fontFamilies.mono,
    fontSize: 10,
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
  },
  chipTextSelected: {
    color: colors.primary[400],
    fontFamily: fontFamilies.bold,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(52, 245, 230, 0.2)',
  },
  countText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.text.tertiary,
  },
  countTextSelected: {
    color: colors.primary[400],
  },
});
