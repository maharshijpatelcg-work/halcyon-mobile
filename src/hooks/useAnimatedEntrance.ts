/**
 * Halcyon — Animated Entrance Hook
 * 
 * Fade + slide up entrance with stagger support.
 */
import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { durations, easings } from '@/theme/animations';

interface UseAnimatedEntranceOptions {
  delay?: number;
  duration?: number;
  slideDistance?: number;
  autoStart?: boolean;
}

export function useAnimatedEntrance(options: UseAnimatedEntranceOptions = {}) {
  const {
    delay = 0,
    duration = durations.normal,
    slideDistance = 30,
    autoStart = true,
  } = options;

  const progress = useSharedValue(0);

  const start = () => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: easings.easeOut })
    );
  };

  const reset = () => {
    progress.value = 0;
  };

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [slideDistance, 0]),
      },
    ],
  }));

  return { animatedStyle, start, reset, progress };
}
