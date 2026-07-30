/**
 * Halcyon — SeverityBadge Component
 * 
 * Color-coded severity badge (CRITICAL=red, HIGH=orange, MEDIUM=yellow, LOW=cyan).
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { IncidentSeverity } from '@/types/incident';
import { fontFamilies, letterSpacings } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  size?: 'sm' | 'md';
}

const BADGE_STYLES: Record<IncidentSeverity, { bg: string; border: string; text: string }> = {
  CRITICAL: {
    bg: 'rgba(255, 100, 120, 0.12)',
    border: 'rgba(255, 100, 120, 0.35)',
    text: '#FF6478',
  },
  HIGH: {
    bg: 'rgba(255, 182, 72, 0.12)',
    border: 'rgba(255, 182, 72, 0.35)',
    text: '#FFB648',
  },
  MEDIUM: {
    bg: 'rgba(255, 230, 100, 0.12)',
    border: 'rgba(255, 230, 100, 0.35)',
    text: '#FFE664',
  },
  LOW: {
    bg: 'rgba(52, 245, 230, 0.12)',
    border: 'rgba(52, 245, 230, 0.35)',
    text: '#34F5E6',
  },
};

export function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const badgeStyle = BADGE_STYLES[severity] || BADGE_STYLES.LOW;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border },
        size === 'md' && styles.badgeMd,
      ]}
    >
      <Text style={[styles.badgeText, { color: badgeStyle.text }, size === 'md' && styles.badgeTextMd]}>
        {severity}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: borderRadius.xs,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    letterSpacing: letterSpacings.wider,
    fontWeight: 'bold',
  },
  badgeTextMd: {
    fontSize: 11,
  },
});
