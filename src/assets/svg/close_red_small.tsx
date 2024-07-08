import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon({color = '#fff'}) {
  return (
    <Svg width="17" height="16" fill="none" viewBox="0 0 17 16">
      <Path
        stroke="#FF6651"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.5 4l-8 8M4.5 4l8 8"></Path>
    </Svg>
  );
}

export default Icon;
