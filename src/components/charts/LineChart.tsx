/**
 * Halcyon — LineChart Component (SVG-based)
 * 
 * Crisp SVG line chart with Liquid Cyan accent, interactive points, and grid lines.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';

interface DataPoint {
  timestamp?: string;
  value: number;
  label?: string;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  width?: number;
  color?: string;
  showDots?: boolean;
  showGrid?: boolean;
}

export function LineChart({
  data,
  height = 160,
  width = 320,
  color = colors.primary[400],
  showDots = true,
  showGrid = true,
}: LineChartProps) {
  if (!data || data.length < 2) {
    return (
      <View style={[styles.container, { height, width }]}>
        <Text style={styles.emptyText}>Insufficient chart data</Text>
      </View>
    );
  }

  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = height - padding - ((d.value - minVal) / range) * chartHeight;
    return { x, y, value: d.value, label: d.label };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <View style={[styles.container, { height, width }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={colors.secondary[300]} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {showGrid && (
          <>
            <Line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <Line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.06)" />
          </>
        )}

        {/* Line Path */}
        <Path d={pathD} stroke="url(#lineGrad)" strokeWidth={2.5} fill="none" />

        {/* Data Dots */}
        {showDots && points.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={colors.background.primary}
            stroke={color}
            strokeWidth={2}
          />
        ))}
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
