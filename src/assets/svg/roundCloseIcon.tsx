import React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="32" height="32" fill="none" viewBox="0 0 32 32">
      <G clipPath="url(#clip0_12156_6740)">
        <Path
          fill="#fff"
          d="M9.53 8.47a.75.75 0 00-1.06 1.06L14.938 16l-6.47 6.47a.75.75 0 001.06 1.06L16 17.06l6.47 6.47a.75.75 0 101.06-1.06L17.06 16l6.47-6.47a.75.75 0 00-1.06-1.06L16 14.94 9.53 8.47z"></Path>
      </G>
      <Rect
        width="31"
        height="31"
        x="0.5"
        y="0.5"
        stroke="#0E0E0E"
        rx="15.5"></Rect>
      <Defs>
        <ClipPath id="clip0_12156_6740">
          <Rect width="32" height="32" fill="#fff" rx="16"></Rect>
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Icon;
