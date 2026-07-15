import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing 
} from "react-native-reanimated";
import { Logo } from "./Logo";
import { useTheme } from "../../providers/ThemeProvider";

interface SplashViewProps {
  onFinish: () => void;
}

export function SplashView({ onFinish }: SplashViewProps) {
  const { colors, isDark } = useTheme();
  
  // Animated values
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0.5);

  useEffect(() => {
    // 1. Logo Scale and Opacity Entrance
    logoScale.value = withTiming(1, { 
      duration: 1200, 
      easing: Easing.out(Easing.back(1.5)) 
    });
    logoOpacity.value = withTiming(1, { 
      duration: 1000 
    });

    // 2. Ring Pulse Animation
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(1.0, { duration: 1000, easing: Easing.out(Easing.ease) })
      ),
      -1,
      true
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.1, { duration: 1000 }),
        withTiming(0.4, { duration: 1000 })
      ),
      -1,
      true
    );

    // 3. Text entrance delay
    const textTimer = setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 800 });
    }, 600);

    // 4. Finish splash after 2.5 seconds
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: withTiming(textOpacity.value === 1 ? 0 : 10, { duration: 800 }) }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.background, 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      {/* Container for logo and background rings */}
      <View style={{ width: 80, height: 80, alignItems: "center", justifyContent: "center" }}>
        {/* Outer Pulse Rings */}
        <Animated.View style={[
          {
            position: "absolute",
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: "rgba(99, 102, 241, 0.5)",
            borderStyle: "dashed"
          },
          ringStyle
        ]} />

        {/* Main Logo Container */}
        <Animated.View style={[{ position: "absolute" }, logoStyle]}>
          <Logo size={80} />
        </Animated.View>
      </View>

      {/* Brand Name & Loading Indicator */}
      <Animated.View style={[{ alignItems: "center", marginTop: 32 }, textStyle]}>
        <Text style={{ 
          fontSize: 28, 
          fontWeight: "900", 
          color: colors.textPrimary, 
          letterSpacing: 2 
        }}>
          HALCYON
        </Text>
        <Text style={{ 
          fontSize: 12, 
          color: colors.textMuted, 
          marginTop: 6,
          fontWeight: "600",
          letterSpacing: 1,
          textTransform: "uppercase"
        }}>
          Incident Response Agent
        </Text>

        <View style={{ height: 40, marginTop: 24, justifyContent: "center" }}>
          <ActivityIndicator size="small" color="#6366F1" />
        </View>
      </Animated.View>
    </View>
  );
}
