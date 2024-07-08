import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="30" height="30" fill="none" viewBox="0 0 30 30">
      <Circle cx="15" cy="15" r="15" fill="#FA347C"></Circle>
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.543 16.113c.747 0 1.352-.588 1.352-1.313s-.605-1.313-1.352-1.313c-.746 0-1.352.588-1.352 1.313s.606 1.313 1.352 1.313zM18.096 11.55a1.313 1.313 0 100-2.626 1.313 1.313 0 000 2.626zM18.096 20.676a1.313 1.313 0 100-2.626 1.313 1.313 0 000 2.626zM13 13.786l3.64-2.535M16.64 18.349L13 15.814"></Path>
    </Svg>
  );
}

export default Icon;
