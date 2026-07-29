/**
 * Halcyon — Clean Social Button (Google)
 * 100% Pure Pitch Black Background (#000000)
 */
import React, { useCallback } from 'react';
import { Pressable, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useScalePress } from '@/hooks/useScalePress';
import { lightHaptic } from '@/utils/haptics';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SocialButtonProps {
  provider: 'google';
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SocialButton({
  provider,
  title,
  onPress,
  loading = false,
  disabled = false,
}: SocialButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = useScalePress({ scaleValue: 0.97 });
  const isDisabled = disabled || loading;

  const handlePress = useCallback(async () => {
    if (!isDisabled) {
      await lightHaptic();
      onPress();
    }
  }, [isDisabled, onPress]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      style={[
        animatedStyle,
        styles.button,
        { opacity: isDisabled ? 0.45 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.text.primary} />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Text style={styles.googleG}>G</Text>
          </View>
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.25)',
    borderRadius: borderRadius.sm,
    backgroundColor: '#000000',
  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  googleG: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#4285F4',
    marginTop: -1,
  },
  text: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.text.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
