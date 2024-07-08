import React from 'react';
import Svg, {Defs, LinearGradient, Path, Rect, Stop} from 'react-native-svg';

export const PostPlayIcon = () => {
  return (
    <Svg width="36" height="36" fill="none" viewBox="0 0 36 36">
      <Rect
        width="35.714"
        height="35.714"
        x="0.144"
        y="0.162"
        fill="#9214F5"
        rx="17.857"></Rect>
      <Rect
        width="35.714"
        height="35.714"
        x="0.144"
        y="0.162"
        fill="url(#paint0_linear_17420_64390)"
        rx="17.857"></Rect>
      <Path
        fill="#fff"
        d="M23.984 15.788l-7.187-4.122a2.545 2.545 0 00-3.817 2.232v8.274a2.544 2.544 0 003.817 2.203l7.187-4.122a2.544 2.544 0 000-4.405v-.06zm-.744 3.118l-7.187 4.181a1.071 1.071 0 01-1.057 0 1.056 1.056 0 01-.528-.915V13.87a1.056 1.056 0 011.056-1.057c.185.004.367.052.529.141l7.187 4.152a1.057 1.057 0 010 1.83v-.03z"></Path>
      <Defs>
        <LinearGradient
          id="paint0_linear_17420_64390"
          x1="0.144"
          x2="35.858"
          y1="0.162"
          y2="35.876"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF701F"></Stop>
          <Stop offset="0.411" stopColor="#9214F5"></Stop>
          <Stop offset="0.755" stopColor="#14CCF5"></Stop>
          <Stop offset="1" stopColor="#08B883"></Stop>
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
