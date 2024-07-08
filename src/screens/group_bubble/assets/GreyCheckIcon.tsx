import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

export const GreyCheckIcon = () => (
  <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
    <Rect width="16" height="16" fill="#fff" fillOpacity="0.2" rx="8"></Rect>
    <Path
      fill="#fff"
      d="M12.473 4.807a.666.666 0 00-.947 0L6.56 9.78 4.473 7.687a.681.681 0 10-.947.98l2.56 2.56a.666.666 0 00.947 0l5.44-5.44a.668.668 0 000-.98z"></Path>
  </Svg>
);
