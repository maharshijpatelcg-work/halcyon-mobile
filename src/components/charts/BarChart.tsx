/**
 * Halcyon — BarChart Component (SVG-based)
 * 
 * Bar chart for statistical breakdowns and cost analysis.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';

interface BarItem {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarItem[];
  height?: number;
  width?: number;
  barColor?: string;
}

export function BarChart({
  data,
  height = 180,
  width = 320,
  barColor = colors.primary[400],
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height, width }]}>
        <Text style={styles.emptyText}>No chart metrics</Text>
      </View>
    );
  }

  const maxVal = Math.max(...data.map(d => d.value)) || 1;
  const paddingBottom = 24;
  const paddingTop = 16;
  const chartHeight = height - paddingBottom - paddingTop;
  const barWidth = Math.max(12, Math.floor((width - 40) / data.length - 8));
  const spacing = Math.floor((width - 30 - barWidth * data.length) / (data.length + 1));

  return (
    <View style={[styles.container, { height, width }]}>
      <Svg width={width} height={height}>
        {data.map((item, index) => {
          const barH = (item.value / maxVal) * chartHeight;
          const x = 15 + spacing + index * (barWidth + spacing);
          const y = height - paddingBottom - barH;
          const fillColor = item.color || barColor;

          return (
            <React.Fragment key={index}>
              {/* Bar Rect */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(4, barH)}
                rx={3}
                fill={fillColor}
              />
              {/* X Label */}
              <SvgText
                x={x + barWidth / 2}
                y={height - 6}
                fill={colors.text.tertiary}
                fontSize={9}
                fontFamily={fontFamilies.mono}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
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
