import React from 'react';
import Svg, {Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="20" height="11" fill="none" viewBox="0 0 20 11">
      <Rect width="2" height="7" y="2" fill="#D9D9D9" rx="1"></Rect>
      <Rect width="2" height="10" x="3" y="0.5" fill="#D9D9D9" rx="1"></Rect>
      <Rect width="2" height="4" x="6" y="3.5" fill="#D9D9D9" rx="1"></Rect>
      <Rect width="2" height="8" x="9" y="1.5" fill="#D9D9D9" rx="1"></Rect>
      <Rect width="2" height="8" x="12" y="1.5" fill="#D9D9D9" rx="1"></Rect>
      <Rect width="2" height="11" x="15" fill="#D9D9D9" rx="1"></Rect>
      <Rect width="2" height="2" x="18" y="4.5" fill="#D9D9D9" rx="1"></Rect>
    </Svg>
  );
}

export default Icon;
