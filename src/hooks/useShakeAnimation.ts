/**
 * Halcyon — Shake Animation Hook (for validation errors)
 */
import {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface UseShakeOptions {
  distance?: number;
  duration?: number;
}

export function useShakeAnimation(options: UseShakeOptions = {}) {
  const { distance = 10, duration = 60 } = options;
  const translateX = useSharedValue(0);

  const shake = () => {
    translateX.value = withSequence(
      withTiming(-distance, { duration }),
      withTiming(distance, { duration }),
      withTiming(-distance * 0.7, { duration }),
      withTiming(distance * 0.7, { duration }),
      withTiming(-distance * 0.3, { duration }),
      withTiming(0, { duration })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { animatedStyle, shake };
}
