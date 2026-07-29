/**
 * Halcyon — Official Brand Logo Component with Razor Sharpness & Cyan Glow Shine
 * 
 * Renders high-resolution, razor-sharp metallic cyan logo assets
 * with dual-layer cyan glow aura illumination.
 */
import React from 'react';
import { View, Image, StyleSheet, ImageStyle, ViewStyle, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePulseAnimation } from '@/hooks/usePulseAnimation';
import { colors } from '@/theme/colors';

export type LogoVariant = 'icon' | 'full' | 'glow' | 'white';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showText?: boolean;
  animated?: boolean;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

const LOGO_ASSETS = {
  icon: require('../../assets/logo/halcyon-icon.png'),
  full: require('../../assets/logo/halcyon-full.png'),
  glow: require('../../assets/logo/halcyon-glow.png'),
  white: require('../../assets/logo/halcyon-white.png'),
};

const ICON_SIZES: Record<LogoSize, { width: number; height: number; glowSize: number }> = {
  sm: { width: 34, height: 34, glowSize: 32 },
  md: { width: 50, height: 50, glowSize: 48 },
  lg: { width: 68, height: 68, glowSize: 64 },
  xl: { width: 100, height: 100, glowSize: 96 },
};

const FULL_SIZES: Record<LogoSize, { width: number; height: number; glowSize: number }> = {
  sm: { width: 100, height: 100, glowSize: 85 },
  md: { width: 145, height: 145, glowSize: 125 },
  lg: { width: 185, height: 185, glowSize: 160 },
  xl: { width: 250, height: 250, glowSize: 220 },
};

export function Logo({
  variant = 'icon',
  size = 'md',
  showText = false,
  animated = true,
  style,
  imageStyle,
}: LogoProps) {
  const { pulseStyle, glowStyle } = usePulseAnimation({
    minOpacity: 0.85,
    maxOpacity: 1,
    minScale: 0.98,
    maxScale: 1.025,
    autoStart: animated,
  });

  const isFull = variant === 'full' || showText;
  const asset = isFull ? LOGO_ASSETS.full : LOGO_ASSETS[variant];
  const sizeConfig = isFull ? FULL_SIZES[size] : ICON_SIZES[size];

  const imgContent = (
    <View style={styles.imageWrapper}>
      {/* Outer Cyan Glow Shine Aura */}
      <Animated.View
        style={[
          styles.cyanGlowOuter,
          {
            width: sizeConfig.glowSize + 12,
            height: sizeConfig.glowSize + 12,
            borderRadius: (sizeConfig.glowSize + 12) / 2,
          },
          glowStyle,
        ]}
      />

      {/* Inner Core Cyan Shine Spot */}
      <Animated.View
        style={[
          styles.cyanGlowInner,
          {
            width: sizeConfig.glowSize - 8,
            height: sizeConfig.glowSize - 8,
            borderRadius: (sizeConfig.glowSize - 8) / 2,
          },
          glowStyle,
        ]}
      />

      {/* Razor-Sharp Official Metallic Cyan Logo Image */}
      <Image
        source={asset}
        style={[
          styles.image,
          {
            width: sizeConfig.width,
            height: sizeConfig.height,
          },
          styles.shadowGlow,
          imageStyle,
        ]}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {animated ? (
        <Animated.View style={pulseStyle}>{imgContent}</Animated.View>
      ) : (
        imgContent
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cyanGlowOuter: {
    position: 'absolute',
    backgroundColor: 'rgba(52, 245, 230, 0.22)',
    zIndex: -2,
  },
  cyanGlowInner: {
    position: 'absolute',
    backgroundColor: 'rgba(120, 215, 255, 0.35)',
    zIndex: -1,
  },
  image: {
    alignSelf: 'center',
  },
  shadowGlow: {
    ...Platform.select({
      ios: {
        shadowColor: '#34F5E6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
