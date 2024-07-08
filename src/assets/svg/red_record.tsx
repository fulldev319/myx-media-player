import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="25" height="24" fill="none" viewBox="0 0 25 24">
      <Path
        stroke="#FF6651"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12.012 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3v0z"></Path>
      <Path
        stroke="#FF6651"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19.012 10v2a7 7 0 11-14 0v-2M12.012 19v4M8.012 23h8"></Path>
    </Svg>
  );
}

export default Icon;
