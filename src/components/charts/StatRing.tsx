/**
 * Halcyon — StatRing Component (SVG-based)
 * 
 * Circular progress ring for Uptime, Resolution Rate, and Memory Match %.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';

interface StatRingProps {
  percent: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export function StatRing({
  percent,
  size = 100,
  strokeWidth = 8,
  color = colors.primary[400],
  label,
}: StatRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.centerContent}>
        <Text style={[styles.percentText, { fontSize: size > 90 ? fontSizes.lg : fontSizes.sm }]}>
          {percent}%
        </Text>
        {label && <Text style={styles.labelText}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontFamily: fontFamilies.bold,
    color: colors.text.primary,
  },
  labelText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.text.tertiary,
    marginTop: 1,
  },
});
