import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function PauseIcon(props) {
  return (
    <Svg width="19" height="19" fill="none" viewBox="0 0 19 19">
      <Rect
        width="18.101"
        height="18.101"
        fill="#fff"
        fillOpacity="0.2"
        rx="9.05"
      />
      <Path
        fill="#fff"
        d="M10.55 5.3a1.125 1.125 0 00-1.125 1.126v5.25a1.125 1.125 0 002.25 0v-5.25A1.125 1.125 0 0010.55 5.3zm.375 6.376a.375.375 0 01-.75 0v-5.25a.375.375 0 11.75 0v5.25zM7.55 5.3a1.125 1.125 0 00-1.125 1.125v5.25a1.125 1.125 0 002.25 0v-5.25A1.125 1.125 0 007.55 5.3zm.375 6.375a.375.375 0 01-.75 0v-5.25a.375.375 0 01.75 0v5.25z"
      />
    </Svg>
  );
}

export default PauseIcon;
