import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <G
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        opacity="0.4">
        <Path d="M10 18.333a8.333 8.333 0 100-16.666 8.333 8.333 0 000 16.666zM12.5 7.5l-5 5M7.5 7.5l5 5"></Path>
      </G>
    </Svg>
  );
}

export default Icon;
