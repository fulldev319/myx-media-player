import React from 'react';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="29" height="30" fill="none" viewBox="0 0 29 30">
      <G clipPath="url(#clip0_12312_7124)">
        <Path
          fill="#fff"
          d="M8.75 8.74a.625.625 0 00-.883.883l5.391 5.392-5.391 5.391a.625.625 0 00.884.884l5.39-5.391 5.392 5.391a.625.625 0 00.884-.884l-5.391-5.391 5.391-5.392a.625.625 0 10-.884-.884l-5.391 5.392L8.75 8.739z"></Path>
      </G>
      <Defs>
        <ClipPath id="clip0_12312_7124">
          <Path
            fill="#fff"
            d="M0 0H20V20H0z"
            transform="rotate(-45 18.124 7.507)"></Path>
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Icon;
