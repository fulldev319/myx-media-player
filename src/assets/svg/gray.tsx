import React from 'react';
import Svg, {Circle} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="100" height="100" fill="none" viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="50" fill="#fff" fillOpacity="0.2"></Circle>
    </Svg>
  );
}

export default Icon;
