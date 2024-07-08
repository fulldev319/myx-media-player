import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <Rect width="24" height="24" fill="#1D8662" rx="12"></Rect>
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.334 8L10 15.333 6.667 12"></Path>
    </Svg>
  );
}

export default Icon;
