import React from 'react';
import Svg, {Circle} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="66" height="66" fill="none" viewBox="0 0 66 66">
      <Circle cx="33" cy="33" r="32.5" stroke="#fff"></Circle>
      <Circle cx="33" cy="33" r="28" fill="#fff"></Circle>
    </Svg>
  );
}

export default Icon;
