import React from 'react';
import Svg, {Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <Rect width="24" height="24" fill="#fff" fillOpacity="0.2" rx="12"></Rect>
      <Rect
        width="23"
        height="23"
        x="0.5"
        y="0.5"
        stroke="#fff"
        strokeOpacity="0.6"
        rx="11.5"></Rect>
    </Svg>
  );
}

export default Icon;
