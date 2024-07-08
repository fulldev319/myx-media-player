import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="32" height="32" fill="none" viewBox="0 0 32 32">
      <Path
        fill="#fff"
        d="M7.293 15.293a1 1 0 000 1.414l6.364 6.364a1 1 0 001.414-1.414L9.414 16l5.657-5.657a1 1 0 00-1.414-1.414l-6.364 6.364zM24 15H8v2h16v-2z"
      />
      <Rect width="31" height="31" x="0.5" y="0.5" stroke="#0E0E0E" rx="15.5" />
    </Svg>
  );
}

export default Icon;
