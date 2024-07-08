import React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="32" height="32" fill="none" viewBox="0 0 32 32">
      <Rect width="32" height="32" fill="#FF6651" rx="16"></Rect>
      <G
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        clipPath="url(#clip0_12495_7504)">
        <Path d="M23.333 20.667A1.333 1.333 0 0122 22H10a1.334 1.334 0 01-1.334-1.333v-7.334A1.333 1.333 0 0110 12h2.666L14 10h4l1.333 2H22a1.333 1.333 0 011.333 1.333v7.334z"></Path>
        <Path d="M16 19.333A2.667 2.667 0 1016 14a2.667 2.667 0 000 5.333z"></Path>
      </G>
      <Defs>
        <ClipPath id="clip0_12495_7504">
          <Path fill="#fff" d="M0 0H16V16H0z" transform="translate(8 8)"></Path>
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Icon;
