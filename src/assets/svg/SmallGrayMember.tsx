import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="12" height="13" fill="none" viewBox="0 0 12 13">
      <G
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4">
        <Path d="M8.5 11v-1a2 2 0 00-2-2h-4a2 2 0 00-2 2v1M4.5 6a2 2 0 100-4 2 2 0 000 4zM11.5 11v-1A2 2 0 0010 8.065M8 2.065A2 2 0 018 5.94"></Path>
      </G>
    </Svg>
  );
}

export default Icon;
