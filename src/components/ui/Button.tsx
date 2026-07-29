/**
 * Halcyon — Premium Obsidian Button Component
 * 
 * Includes top-center cyan glare reflection spot for primary/cyan buttons,
 * scale press animation, and monospace uppercase typography.
 */
import React, { useCallback } from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useScalePress } from '@/hooks/useScalePress';
import { lightHaptic } from '@/utils/haptics';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'cyan';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  primary: {
    bg: '#0A0E17',
    text: colors.primary[400],
    border: 'rgba(52, 245, 230, 0.3)',
  },
  cyan: {
    bg: '#0A0E17',
    text: colors.primary[400],
    border: 'rgba(52, 245, 230, 0.4)',
  },
  secondary: {
    bg: 'rgba(52, 245, 230, 0.08)',
    text: colors.primary[400],
    border: 'rgba(52, 245, 230, 0.25)',
  },
  outline: {
    bg: 'transparent',
    text: colors.white,
    border: colors.border.light,
  },
  ghost: {
    bg: 'transparent',
    text: colors.text.secondary,
    border: 'transparent',
  },
  danger: {
    bg: colors.error.bg,
    text: colors.error.default,
    border: colors.error.border,
  },
};

const SIZE_STYLES: Record<ButtonSize, { height: number; paddingH: number; fontSize: number; letterSpacing: number }> = {
  sm: { height: 40, paddingH: spacing.md, fontSize: fontSizes['2xs'], letterSpacing: 1.2 },
  md: { height: 48, paddingH: spacing.lg, fontSize: fontSizes.xs, letterSpacing: 1.5 },
  lg: { height: 54, paddingH: spacing.xl, fontSize: fontSizes.xs, letterSpacing: 1.5 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = true,
}: ButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = useScalePress({ scaleValue: 0.97 });
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  const handlePress = useCallback(async () => {
    if (!isDisabled) {
      await lightHaptic();
      onPress();
    }
  }, [isDisabled, onPress]);

  const hasTopGlare = variant === 'primary' || variant === 'cyan';

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      style={[
        animatedStyle,
        styles.base,
        {
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingH,
          opacity: isDisabled ? 0.45 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {/* Top Center Cyan Glare Reflection Spot */}
      {hasTopGlare && <View style={styles.topCyanGlare} />}

      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.text} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: variantStyle.text,
                fontSize: sizeStyle.fontSize,
                letterSpacing: sizeStyle.letterSpacing,
              },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  fullWidth: {
    width: '100%',
  },
  topCyanGlare: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 140,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34F5E6',
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconWrapper: {
    marginRight: spacing.xs,
  },
  text: {
    fontFamily: fontFamilies.mono,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
