/**
 * Halcyon — Clean 100% Pure Pitch Black Card Component (#000000)
 * 
 * Crisp pitch black surface panel with clean cyan border, zero gray tint.
 */
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedEntrance } from '@/hooks/useAnimatedEntrance';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'cyanGlow';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
  animationDelay?: number;
  noPadding?: boolean;
}

const VARIANT_STYLES: Record<CardVariant, ViewStyle> = {
  default: {
    backgroundColor: '#000000',
    borderColor: 'rgba(52, 245, 230, 0.2)',
    borderWidth: 1,
  },
  elevated: {
    backgroundColor: '#000000',
    borderColor: 'rgba(52, 245, 230, 0.25)',
    borderWidth: 1,
  },
  outlined: {
    backgroundColor: '#000000',
    borderColor: 'rgba(52, 245, 230, 0.2)',
    borderWidth: 1,
  },
  glass: {
    backgroundColor: '#000000',
    borderColor: 'rgba(52, 245, 230, 0.2)',
    borderWidth: 1,
  },
  cyanGlow: {
    backgroundColor: '#000000',
    borderColor: 'rgba(52, 245, 230, 0.3)',
    borderWidth: 1,
  },
};

export function Card({
  children,
  variant = 'default',
  style,
  animated = true,
  animationDelay = 0,
  noPadding = false,
}: CardProps) {
  const { animatedStyle } = useAnimatedEntrance({
    delay: animationDelay,
    autoStart: animated,
    slideDistance: animated ? 16 : 0,
  });

  const cardStyle = [
    styles.base,
    VARIANT_STYLES[variant],
    !noPadding && styles.padding,
    style,
  ];

  if (animated) {
    return (
      <Animated.View style={[cardStyle, animatedStyle]}>
        {children}
      </Animated.View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  padding: {
    padding: spacing.base,
  },
});
