import React from 'react';
import Svg, {Circle, Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="90" height="90" fill="none" viewBox="0 0 90 90">
      <Circle cx="45" cy="45" r="45" fill="#fff" fillOpacity="0.3"></Circle>
      <Circle cx="45" cy="45" r="38" fill="#fff" fillOpacity="0.5"></Circle>
      <Circle cx="45" cy="45" r="33" fill="#fff"></Circle>
      <Rect width="30" height="30" x="30" y="30" fill="#FF3F3F" rx="7"></Rect>
    </Svg>
  );
}

export default Icon;
