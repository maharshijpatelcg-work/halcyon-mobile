/**
 * Halcyon — AreaChart Component (SVG-based)
 * 
 * Smooth area chart with cyan-to-transparent gradient fill for telemetry metrics.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';

interface DataPoint {
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  height?: number;
  width?: number;
  color?: string;
}

export function AreaChart({
  data,
  height = 140,
  width = 300,
  color = colors.primary[400],
}: AreaChartProps) {
  if (!data || data.length < 2) {
    return (
      <View style={[styles.container, { height, width }]}>
        <Text style={styles.emptyText}>No area data available</Text>
      </View>
    );
  }

  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = height - padding - ((d.value - minVal) / range) * chartHeight;
    return { x, y };
  });

  const lineD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = `${lineD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <View style={[styles.container, { height, width }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Gradient Area Fill */}
        <Path d={areaD} fill="url(#areaGrad)" />

        {/* Top Boundary Line */}
        <Path d={lineD} stroke={color} strokeWidth={2} fill="none" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.text.tertiary,
  },
});
