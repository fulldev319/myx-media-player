import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="12" height="13" fill="none" viewBox="0 0 12 13">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6.25a4.19 4.19 0 01-.45 1.9 4.25 4.25 0 01-5.7 1.9L1.5 11l.95-2.85A4.25 4.25 0 016.25 2h.25a4.24 4.24 0 014 4v.25z"
        opacity="0.4"></Path>
    </Svg>
  );
}

export default Icon;
