import React from 'react';
import Svg, {Defs, G, Path, Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <G filter="url(#filter0_b_14840_17487)">
        <Rect
          width="20"
          height="20"
          fill="#fff"
          fillOpacity="0.2"
          rx="10"></Rect>
        <Path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.5 13V6.5l6-1V12"></Path>
        <Path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 14.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></Path>
      </G>
    </Svg>
  );
}

export default Icon;
