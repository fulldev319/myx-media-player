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
        d="M19.012 3h-14a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"></Path>
      <Path
        stroke="#FF6651"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.512 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21.012 15l-5-5-11 11"></Path>
    </Svg>
  );
}

export default Icon;
