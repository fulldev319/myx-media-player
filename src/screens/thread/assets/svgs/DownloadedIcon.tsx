import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function DownloadedIcon(props) {
  return (
    <Svg width="21" height="20" fill="none" viewBox="0 0 21 20">
      <Rect width="18" height="18" x="1.902" y="1" fill="#08B883" rx="9" />
      <Path
        fill="#fff"
        d="M14.257 7.605a.5.5 0 00-.71 0l-3.725 3.73-1.565-1.57a.51.51 0 10-.71.735l1.92 1.92a.5.5 0 00.71 0l4.08-4.08a.5.5 0 000-.735z"
      />
      <Rect
        width="18"
        height="18"
        x="1.902"
        y="1"
        stroke="#010101"
        strokeWidth="2"
        rx="9"
      />
    </Svg>
  );
}

export default DownloadedIcon;
