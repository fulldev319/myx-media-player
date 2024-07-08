import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="62" height="62" fill="none" viewBox="0 0 62 62">
      <Path
        fill="#fff"
        fillOpacity="0.2"
        stroke="#fff"
        strokeLinecap="round"
        strokeOpacity="0.6"
        d="M51 1H11C5.477 1 1 5.477 1 11v40c0 5.523 4.477 10 10 10h40c5.523 0 10-4.477 10-10V11c0-5.523-4.477-10-10-10z"></Path>
      <Path
        stroke="#fff"
        strokeLinecap="round"
        d="M31.5 23.583v14.833M38.916 31H24.083"></Path>
    </Svg>
  );
}

export default Icon;
