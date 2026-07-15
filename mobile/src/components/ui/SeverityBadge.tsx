import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SEVERITY_COLORS } from "../../constants/colors";
import type { Severity } from "../../types";

interface SeverityBadgeProps {
  severity: Severity | string | null;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

const SIZE_CONFIG = {
  sm: { px: 8, py: 3, fontSize: 10, dotSize: 5 },
  md: { px: 10, py: 4, fontSize: 11, dotSize: 6 },
  lg: { px: 12, py: 6, fontSize: 13, dotSize: 7 },
};

/**
 * Severity badge with pulsing dot for CRITICAL.
 */
export function SeverityBadge({ severity, size = "md", showDot = true }: SeverityBadgeProps) {
  const sev = (severity?.toUpperCase() ?? "MEDIUM") as Severity;
  const colors = SEVERITY_COLORS[sev] ?? SEVERITY_COLORS.MEDIUM;
  const config = SIZE_CONFIG[size];

  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (sev === "CRITICAL") {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 800 }),
          withTiming(1, { duration: 800 }),
        ),
        -1,
        true,
      );
    } else {
      pulseOpacity.value = 1;
    }
  }, [sev, pulseOpacity]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.bg,
        paddingHorizontal: config.px,
        paddingVertical: config.py,
        borderRadius: 99,
      }}
    >
      {showDot && (
        <Animated.View
          style={[
            {
              width: config.dotSize,
              height: config.dotSize,
              borderRadius: config.dotSize / 2,
              backgroundColor: colors.dot,
              marginRight: 6,
            },
            sev === "CRITICAL" ? dotStyle : {},
          ]}
        />
      )}
      <Text style={{ color: colors.text, fontSize: config.fontSize, fontWeight: "700" }}>
        {sev}
      </Text>
    </View>
  );
}
