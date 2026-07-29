/**
 * Halcyon — Scale Press Animation Hook
 */
import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { timingConfigs } from '@/theme/animations';

interface UseScalePressOptions {
  scaleValue?: number;
}

export function useScalePress(options: UseScalePressOptions = {}) {
  const { scaleValue = 0.97 } = options;
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withTiming(scaleValue, timingConfigs.scalePress);
  }, [scaleValue]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, timingConfigs.scalePress);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, onPressIn, onPressOut };
}
