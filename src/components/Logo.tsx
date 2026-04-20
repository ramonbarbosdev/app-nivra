import React from 'react';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
  Rect,
  Circle,
  Line,
  Text as SvgText,
} from 'react-native-svg';

export function Logo() {
  return (
    <Svg width={260} height={70} viewBox="0 0 620 148">
      <Defs>
        <RadialGradient id="liG" cx="38%" cy="32%" r="60%">
          <Stop offset="0%" stopColor="#7f5af0" stopOpacity="0.28" />
          <Stop offset="100%" stopColor="#7f5af0" stopOpacity="0" />
        </RadialGradient>

        <LinearGradient id="lrG" x1="0.3" y1="0" x2="0.7" y2="1">
          <Stop offset="0%" stopColor="#a78bfa" />
          <Stop offset="100%" stopColor="#7f5af0" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="9" y="9" width="130" height="130" rx="28" fill="#16161a" />
      <Rect x="9" y="9" width="130" height="130" rx="28" fill="url(#liG)" />

      {/* Ring */}
      <Circle cx="74" cy="62" r="40" fill="#16161a" stroke="url(#lrG)" strokeWidth="13" />

      {/* Accent */}
      <Circle cx="122" cy="116" r="5" fill="#2cb67d" />

      {/* Text */}
      <SvgText
        x="158"
        y="86"
        fontSize="48"
        fontWeight="800"
        fill="#fffffe"
      >
        Questify
      </SvgText>

      <SvgText
        x="158"
        y="120"
        fontSize="16"
        fontWeight="700"
        fill="#7f5af0"
      >
        GO · DESAFIO DIÁRIO
      </SvgText>
    </Svg>
  );
}