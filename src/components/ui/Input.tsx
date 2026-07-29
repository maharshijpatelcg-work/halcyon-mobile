/**
 * Halcyon — Universal 4-Side Perimeter Wave Input Component
 * 
 * 4-side perimeter sine wave undulating smoothly around all 4 edges of the input field:
 *  - ⚪ WHITE (#FFFFFF) wave animation when focused with NO input
 *  - 🟢 GREEN (#22F2B4) wave animation when criteria is VALID
 *  - 🔴 RED (#FF3B5C) wave animation when criteria FAILS
 */
import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, TextInputProps, Platform, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string | null;
  isValid?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

const INPUT_HEIGHT = 48;

const STATE_COLORS = {
  WHITE: '#FFFFFF',
  GREEN: '#22F2B4',
  RED: '#FF3B5C',
};

// Strict Validation Regexes
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s]{2,}$/; // Only letters and spaces

export function Input({
  label,
  error,
  isValid,
  icon,
  rightIcon,
  isPassword = false,
  value,
  onChangeText,
  keyboardType,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [boxWidth, setBoxWidth] = useState<number>(320);

  const focusAnim = useSharedValue(0);
  const clickRippleAnim = useSharedValue(1);
  const wavePhase = useSharedValue(0);

  const rawText = value ? String(value).trim() : '';
  const labelLower = label.toLowerCase();

  const isEmailInput = keyboardType === 'email-address' || labelLower.includes('email');
  const isPasswordInput = isPassword || labelLower.includes('password');
  const isNameInput = labelLower.includes('name') || labelLower.includes('full name');

  // Compute criteria validity dynamically
  let meetsCriteria = false;
  let failsCriteria = false;
  let criteriaErrorMessage = '';

  if (rawText.length > 0) {
    if (isEmailInput) {
      meetsCriteria = EMAIL_REGEX.test(rawText);
      failsCriteria = !meetsCriteria;
      criteriaErrorMessage = 'Please enter a valid email address (e.g. name@gmail.com)';
    } else if (isPasswordInput) {
      meetsCriteria = rawText.length >= 6;
      failsCriteria = !meetsCriteria;
      criteriaErrorMessage = 'Password must be at least 6 characters';
    } else if (isNameInput) {
      meetsCriteria = NAME_REGEX.test(rawText);
      failsCriteria = !meetsCriteria;
      criteriaErrorMessage = 'Full name must contain only letters and spaces (no @, commas, or symbols)';
    } else {
      meetsCriteria = rawText.length >= 2;
      failsCriteria = !meetsCriteria;
      criteriaErrorMessage = 'Invalid input format';
    }
  }

  // Determine active state color: RED (error/invalid), GREEN (valid), WHITE (empty/no input)
  const isWrong = !!error || failsCriteria;
  const isCorrect = isValid !== undefined ? isValid : (meetsCriteria && !isWrong);

  const activeColorState = isWrong ? 'RED' : isCorrect ? 'GREEN' : 'WHITE';
  const currentStateColor = STATE_COLORS[activeColorState];

  useEffect(() => {
    // 60 FPS continuous wave motion phase oscillation
    wavePhase.value = withRepeat(
      withTiming(Math.PI * 4, {
        duration: 2600,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });

    clickRippleAnim.value = withSequence(
      withTiming(1.02, { duration: 120, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 12, stiffness: 180 })
    );
  }, [focusAnim, clickRippleAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
  }, [focusAnim]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && Math.abs(width - boxWidth) > 2) {
      setBoxWidth(width);
    }
  }, [boxWidth]);

  // Click scale pulse + state color border
  const animatedWrapperStyle = useAnimatedStyle(() => {
    const borderColor = isWrong
      ? STATE_COLORS.RED
      : interpolateColor(
          focusAnim.value,
          [0, 1],
          ['rgba(255, 255, 255, 0.2)', currentStateColor]
        );

    return {
      transform: [{ scale: clickRippleAnim.value }],
      borderColor,
    };
  });

  // Top horizontal perimeter wave
  const createHorizontalWave = (w: number, yPos: number, phase: number) => {
    let d = `M 6 ${yPos}`;
    const step = Math.max(4, Math.floor(w / 35));
    for (let x = 6; x <= w - 6; x += step) {
      const y = yPos + Math.sin((x * 0.025) + phase) * 2.2;
      d += ` L ${x} ${Math.round(y * 100) / 100}`;
    }
    return d;
  };

  // Vertical perimeter wave
  const createVerticalWave = (h: number, xPos: number, phase: number) => {
    let d = `M ${xPos} 6`;
    const step = Math.max(4, Math.floor(h / 16));
    for (let y = 6; y <= h - 6; y += step) {
      const x = xPos + Math.sin((y * 0.045) + phase) * 2.2;
      d += ` L ${Math.round(x * 100) / 100} ${y}`;
    }
    return d;
  };

  const topWaveProps = useAnimatedProps(() => ({
    d: createHorizontalWave(boxWidth, 2, wavePhase.value),
  }));

  const bottomWaveProps = useAnimatedProps(() => ({
    d: createHorizontalWave(boxWidth, INPUT_HEIGHT - 2, wavePhase.value + Math.PI),
  }));

  const leftWaveProps = useAnimatedProps(() => ({
    d: createVerticalWave(INPUT_HEIGHT, 2, wavePhase.value),
  }));

  const rightWaveProps = useAnimatedProps(() => ({
    d: createVerticalWave(INPUT_HEIGHT, boxWidth - 2, wavePhase.value + Math.PI),
  }));

  const waveOverlayStyle = useAnimatedStyle(() => ({
    opacity: focusAnim.value,
  }));

  const gradId = `wave_grad_${activeColorState}`;

  return (
    <View style={styles.cardEnclosure}>
      {/* Label & Icon Header */}
      <View style={styles.labelRow}>
        {icon && <View style={styles.labelIcon}>{icon}</View>}
        <Text style={[styles.label, { color: currentStateColor }]}>{label}</Text>
      </View>

      {/* Input Inner Wrapper with State Color Border */}
      <Animated.View
        onLayout={handleLayout}
        style={[
          styles.inputWrapper,
          animatedWrapperStyle,
          isWrong && styles.errorBorder,
        ]}
      >
        <TextInput
          {...textInputProps}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={[styles.input, webFocusOutlineFix]}
          placeholderTextColor={colors.text.placeholder}
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={currentStateColor}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={12}
            style={styles.eyeButton}
          >
            <Text style={[styles.eyeIcon, { color: currentStateColor }]}>
              {showPassword ? '◉' : '◎'}
            </Text>
          </Pressable>
        )}

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}

        {/* Universal 4-Side Perimeter Wave Overlay (WHITE / GREEN / RED) */}
        <Animated.View style={[styles.waveOverlay, waveOverlayStyle]} pointerEvents="none">
          <Svg width={boxWidth} height={INPUT_HEIGHT}>
            <Defs>
              <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={currentStateColor} stopOpacity="0.35" />
                <Stop offset="50%" stopColor={currentStateColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={currentStateColor} stopOpacity="0.35" />
              </LinearGradient>
            </Defs>

            {/* 4-Side Perimeter Wave Lines */}
            <AnimatedPath animatedProps={topWaveProps} stroke={`url(#${gradId})`} strokeWidth="2.2" fill="none" />
            <AnimatedPath animatedProps={bottomWaveProps} stroke={`url(#${gradId})`} strokeWidth="2.2" fill="none" />
            <AnimatedPath animatedProps={leftWaveProps} stroke={`url(#${gradId})`} strokeWidth="2.2" fill="none" />
            <AnimatedPath animatedProps={rightWaveProps} stroke={`url(#${gradId})`} strokeWidth="2.2" fill="none" />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* Error message */}
      {(error || (failsCriteria && rawText.length > 0)) && (
        <View style={styles.errorRow}>
          <Text style={styles.errorDot}>•</Text>
          <Text style={styles.error}>
            {error || criteriaErrorMessage}
          </Text>
        </View>
      )}
    </View>
  );
}

const webFocusOutlineFix = Platform.OS === 'web' ? ({
  outlineStyle: 'none',
  outlineWidth: 0,
} as any) : {};

const styles = StyleSheet.create({
  cardEnclosure: {
    marginBottom: spacing.md,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingLeft: 2,
  },
  labelIcon: {
    marginRight: 8,
  },
  label: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    letterSpacing: letterSpacings.wider,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    backgroundColor: '#000000',
    paddingHorizontal: spacing.md,
    height: INPUT_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  errorBorder: {
    borderColor: STATE_COLORS.RED,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.base,
    color: colors.text.primary,
    height: '100%',
    paddingVertical: 0,
    zIndex: 2,
  },
  eyeButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  eyeIcon: {
    fontSize: 18,
  },
  rightIcon: {
    marginLeft: spacing.sm,
    justifyContent: 'center',
    zIndex: 2,
  },
  waveOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingLeft: 2,
  },
  errorDot: {
    color: colors.error.default,
    fontSize: 10,
    marginRight: 6,
  },
  error: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: colors.error.default,
    lineHeight: fontSizes.xs * 1.4,
  },
});
