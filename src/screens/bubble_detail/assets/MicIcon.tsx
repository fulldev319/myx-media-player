import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function MicIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={32} height={32} rx={16} fill="#9214F5" />
      <Path
        d="M16 18a2.667 2.667 0 002.667-2.666v-4a2.667 2.667 0 10-5.334 0v4A2.667 2.667 0 0016 18zm-1.333-6.666a1.333 1.333 0 112.666 0v4a1.334 1.334 0 01-2.666 0v-4zm6.666 4a.667.667 0 10-1.333 0 4 4 0 01-8 0 .667.667 0 00-1.333 0 5.334 5.334 0 004.666 5.286V22H14a.667.667 0 000 1.334h4A.667.667 0 0018 22h-1.333v-1.38a5.333 5.333 0 004.666-5.286z"
        fill="#fff"
      />
    </Svg>
  );
}

export default MicIcon;
