import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="18" height="20" fill="none" viewBox="0 0 18 20">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M1 6.1v7.8M5 4.8v10.4M9 3.5v13M13 4.8v10.4M17 6.1v7.8"></Path>
    </Svg>
  );
}

export default Icon;
