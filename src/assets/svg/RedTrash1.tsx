import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="17" height="17" fill="none" viewBox="0 0 17 17">
      <Path
        stroke="#FF3F3F"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.125 4.25h12.75M5.667 4.25V2.833a1.417 1.417 0 011.417-1.416h2.833a1.416 1.416 0 011.417 1.416V4.25m2.125 0v9.917a1.417 1.417 0 01-1.417 1.416H4.959a1.417 1.417 0 01-1.417-1.416V4.25h9.917zM9.917 7.792v4.25M7.083 7.792v4.25"
      />
    </Svg>
  );
}

export default Icon;
