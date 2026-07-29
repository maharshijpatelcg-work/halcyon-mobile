/**
 * Halcyon — Fully Responsive 100% Width Animated Wave Oscilloscope
 * 
 * Dynamically measures container width (onLayout) to stretch sine waves,
 * glowing nodes, and particle streams across 100% full width on all devices
 * (from iPhone SE 320px up to 4K Ultra-wide Desktop Monitors).
 */
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { Card } from '@/components/ui/Card';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SVG_HEIGHT = 130;
const MID_Y = 65;

export function Oscilloscope() {
  const [containerWidth, setContainerWidth] = useState<number>(360);

  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(Math.PI * 4, {
        duration: 3500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && Math.abs(width - containerWidth) > 2) {
      setContainerWidth(width);
    }
  }, [containerWidth]);

  // Helper to generate dynamic sine wave path across full measured width
  const createSinePath = (offset: number, amplitude: number, frequency: number, w: number) => {
    let d = `M 0 ${MID_Y}`;
    const step = Math.max(5, Math.floor(w / 40));
    for (let x = 0; x <= w; x += step) {
      const y = MID_Y + Math.sin((x * frequency) + offset) * amplitude;
      d += ` L ${x} ${Math.round(y * 100) / 100}`;
    }
    d += ` L ${w} ${MID_Y + Math.sin((w * frequency) + offset) * amplitude}`;
    return d;
  };

  // Primary wave props
  const primaryWaveProps = useAnimatedProps(() => {
    return {
      d: createSinePath(phase.value, 18, 0.012, containerWidth),
    };
  });

  // Secondary wave props
  const secondaryWaveProps = useAnimatedProps(() => {
    return {
      d: createSinePath(-phase.value * 0.7, 14, 0.016, containerWidth),
    };
  });

  // Tertiary wave props
  const tertiaryWaveProps = useAnimatedProps(() => {
    return {
      d: createSinePath(phase.value * 1.3, 9, 0.01, containerWidth),
    };
  });

  // Dynamic node 1 (20% width)
  const node1Props = useAnimatedProps(() => {
    const x = containerWidth * 0.22;
    const y = MID_Y + Math.sin((x * 0.012) + phase.value) * 18;
    return { cx: x, cy: y };
  });

  // Dynamic node 2 (50% width)
  const node2Props = useAnimatedProps(() => {
    const x = containerWidth * 0.5;
    const y = MID_Y + Math.sin((x * 0.012) + phase.value) * 18;
    return { cx: x, cy: y };
  });

  // Dynamic node 3 (78% width)
  const node3Props = useAnimatedProps(() => {
    const x = containerWidth * 0.78;
    const y = MID_Y + Math.sin((x * 0.012) + phase.value) * 18;
    return { cx: x, cy: y };
  });

  return (
    <Card variant="glass" noPadding style={styles.terminalCard}>
      <View style={styles.waveformContainer} onLayout={handleLayout}>
        <Svg width={containerWidth} height={SVG_HEIGHT} viewBox={`0 0 ${containerWidth} ${SVG_HEIGHT}`}>
          <Defs>
            <LinearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#34F5E6" stopOpacity="0.4" />
              <Stop offset="30%" stopColor="#34F5E6" stopOpacity="1" />
              <Stop offset="70%" stopColor="#78D7FF" stopOpacity="1" />
              <Stop offset="100%" stopColor="#34F5E6" stopOpacity="0.4" />
            </LinearGradient>
          </Defs>

          {/* Tertiary Wave */}
          <AnimatedPath
            animatedProps={tertiaryWaveProps}
            stroke="rgba(52, 245, 230, 0.25)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Secondary Wave */}
          <AnimatedPath
            animatedProps={secondaryWaveProps}
            stroke="rgba(52, 245, 230, 0.45)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Primary Bright Wave */}
          <AnimatedPath
            animatedProps={primaryWaveProps}
            stroke="url(#cyanGradient)"
            strokeWidth="2.8"
            fill="none"
          />

          {/* Dynamic Nodes along wave */}
          <AnimatedCircle animatedProps={node1Props} r="4" fill="#34F5E6" />
          <AnimatedCircle animatedProps={node1Props} r="7" fill="rgba(52, 245, 230, 0.35)" />

          <AnimatedCircle animatedProps={node2Props} r="4" fill="#34F5E6" />
          <AnimatedCircle animatedProps={node2Props} r="7" fill="rgba(52, 245, 230, 0.35)" />

          <AnimatedCircle animatedProps={node3Props} r="4.5" fill="#34F5E6" />
          <AnimatedCircle animatedProps={node3Props} r="8" fill="rgba(52, 245, 230, 0.4)" />

          {/* Dynamic Floating Particles distributed across full width */}
          <Circle cx={containerWidth * 0.1} cy="45" r="1.5" fill="#34F5E6" opacity={0.6} />
          <Circle cx={containerWidth * 0.18} cy="88" r="2" fill="#34F5E6" opacity={0.7} />
          <Circle cx={containerWidth * 0.32} cy="35" r="1.2" fill="#34F5E6" opacity={0.5} />
          <Circle cx={containerWidth * 0.42} cy="92" r="2.2" fill="#78D7FF" opacity={0.8} />
          <Circle cx={containerWidth * 0.6} cy="30" r="1.5" fill="#34F5E6" opacity={0.6} />
          <Circle cx={containerWidth * 0.72} cy="85" r="1.8" fill="#34F5E6" opacity={0.7} />
          <Circle cx={containerWidth * 0.88} cy="42" r="1.5" fill="#78D7FF" opacity={0.6} />
          <Circle cx={containerWidth * 0.95} cy="78" r="1.2" fill="#34F5E6" opacity={0.5} />
        </Svg>

        {/* System State Overlay Badge */}
        <View style={styles.systemStateBadge}>
          <Text style={styles.systemStateText}>
            SYSTEM_STATE: <Text style={{ color: colors.primary[400], fontWeight: 'bold' }}>RESOLVED (98% MATCH)</Text>
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  terminalCard: {
    backgroundColor: '#04070D',
    borderColor: 'rgba(52, 245, 230, 0.25)',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    width: '100%',
  },
  waveformContainer: {
    height: SVG_HEIGHT,
    backgroundColor: '#04070D',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  systemStateBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(7, 10, 15, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.3)',
    borderRadius: borderRadius.xs,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
  },
  systemStateText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
  },
});
