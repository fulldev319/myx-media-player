import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="12" height="13" fill="none" viewBox="0 0 12 13">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 1.5l1.545 3.13L11 5.135 8.5 7.57l.59 3.44L6 9.385 2.91 11.01l.59-3.44L1 5.135l3.455-.505L6 1.5z"
        opacity="0.4"></Path>
    </Svg>
  );
}

export default Icon;
