import React from 'react';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <G
        stroke="#FF6651"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        clipPath="url(#clip0_15277_13320)">
        <Path d="M10.667 14v-1.333A2.667 2.667 0 008 10H3.333a2.667 2.667 0 00-2.666 2.667V14M5.667 7.333a2.667 2.667 0 100-5.333 2.667 2.667 0 000 5.333zM13.333 5.333v4M15.333 7.333h-4"></Path>
      </G>
      <Defs>
        <ClipPath id="clip0_15277_13320">
          <Path fill="#fff" d="M0 0H16V16H0z"></Path>
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Icon;
