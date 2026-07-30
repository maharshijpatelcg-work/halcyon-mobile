/**
 * Halcyon — ToggleSwitch Component
 * 
 * Animated toggle switch (Cyan active, dark inactive).
 */
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme/colors';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export function ToggleSwitch({ value, onValueChange }: ToggleSwitchProps) {
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(value ? 20 : 2, { duration: 180 }) }],
    backgroundColor: value ? '#000000' : colors.text.tertiary,
  }));

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(value ? colors.primary[400] : '#1A1A1A', { duration: 180 }),
    borderColor: withTiming(value ? colors.primary[400] : '#333333', { duration: 180 }),
  }));

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
});
