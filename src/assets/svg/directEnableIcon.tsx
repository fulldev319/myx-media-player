import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3 3h14M17 6H3v8h14V6zM3 17h14"></Path>
    </Svg>
  );
}

export default Icon;
