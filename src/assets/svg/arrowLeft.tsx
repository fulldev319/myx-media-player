import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon({color = 'white'}) {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M15 6l-6 6 6 6"></Path>
    </Svg>
  );
}

export default Icon;
