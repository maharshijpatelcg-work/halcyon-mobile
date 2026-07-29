/**
 * Halcyon — Pulse/Glow Animation Hook
 */
import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { easings } from '@/theme/animations';

interface UsePulseOptions {
  minOpacity?: number;
  maxOpacity?: number;
  minScale?: number;
  maxScale?: number;
  duration?: number;
  autoStart?: boolean;
}

export function usePulseAnimation(options: UsePulseOptions = {}) {
  const {
    minOpacity = 0.4,
    maxOpacity = 1,
    minScale = 0.97,
    maxScale = 1.03,
    duration = 2000,
    autoStart = true,
  } = options;

  const progress = useSharedValue(0);

  const start = () => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: easings.easeInOut }),
      -1, // infinite
      true // reverse
    );
  };

  const stop = () => {
    progress.value = 0;
  };

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [minOpacity, maxOpacity]),
    transform: [
      { scale: interpolate(progress.value, [0, 1], [minScale, maxScale]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [minOpacity, maxOpacity]),
  }));

  return { pulseStyle, glowStyle, start, stop };
}
