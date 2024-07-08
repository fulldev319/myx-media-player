import React from 'react';
import Svg, {Circle, Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <Rect
        width="16"
        height="16"
        fill="#FF6651"
        fillOpacity="0.1"
        rx="8"></Rect>
      <Circle cx="8" cy="8" r="4" fill="#FF6651"></Circle>
      <Rect
        width="15"
        height="15"
        x="0.5"
        y="0.5"
        stroke="#FF6651"
        strokeOpacity="0.2"
        rx="7.5"></Rect>
    </Svg>
  );
}

export default Icon;
