import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface StatusDotProps {
  status: "online" | "offline" | "warning";
  size?: number;
  pulse?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  online:  "#34D399",
  offline: "#EF4444",
  warning: "#FBBF24",
};

export function StatusDot({ status, size = 8, pulse = true }: StatusDotProps) {
  const color = STATUS_COLORS[status];
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (pulse && status === "online") {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.8, { duration: 1200 }),
          withTiming(1, { duration: 1200 }),
        ),
        -1,
        true,
      );
    }
  }, [pulse, status, pulseScale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 2 - pulseScale.value,
  }));

  return (
    <View style={{ width: size * 2.5, height: size * 2.5, alignItems: "center", justifyContent: "center" }}>
      {pulse && status === "online" && (
        <Animated.View
          style={[
            {
              position: "absolute",
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
            pulseStyle,
          ]}
        />
      )}
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
}
