import React, { useEffect, useState } from "react";
import { Text, type TextStyle } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: TextStyle;
}

/**
 * Animated number counter — counts from 0 to target value with easing.
 */
export function AnimatedCounter({
  value,
  duration = 1200,
  prefix = "",
  suffix = "",
  decimals = 0,
  style,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const { colors } = useTheme();

  useEffect(() => {
    const startTime = Date.now();

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      setDisplayValue(current.toFixed(decimals));
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  }, [value, duration, decimals]);

  return (
    <Text
      style={[
        { fontSize: 28, fontWeight: "800", color: colors.textPrimary },
        style,
      ]}
    >
      {prefix}{displayValue}{suffix}
    </Text>
  );
}
