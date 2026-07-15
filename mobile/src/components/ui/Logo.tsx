import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop, G } from "react-native-svg";

interface LogoProps {
  size?: number;
}

export function Logo({ size = 64 }: LogoProps) {
  // Renders a premium vector reconstruction of the circular Halcyon swirl logo
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#15331B" />
          <Stop offset="30%" stopColor="#3B7A27" />
          <Stop offset="70%" stopColor="#7CC144" />
          <Stop offset="100%" stopColor="#A7F3D0" />
        </LinearGradient>
      </Defs>
      
      <G transform="translate(50, 50)">
        {/* Render 6 curved spiral blades rotated around the center */}
        {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
          <G key={idx} transform={`rotate(${angle})`}>
            <Path
              d="M 0,-42 C 12,-42 22,-30 18,-14 C 15,-1 3,-8 0,-15 C -3,-8 -15,-1 -18,-14 C -22,-30 -12,-42 0,-42 Z"
              fill="url(#logoGrad)"
              opacity={0.85 + idx * 0.03}
              transform="skewX(15) scale(0.9)"
            />
          </G>
        ))}
      </G>
    </Svg>
  );
}
