import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function HideThreadIcon(props) {
  return (
    <Svg
      width={56}
      height={56}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={56} height={56} rx={28} fill="#FF3F3F" fillOpacity={0.1} />
      <Path
        d="M29.3 28.22A4.92 4.92 0 0031 24.5a5 5 0 10-10 0 4.92 4.92 0 001.7 3.72A8 8 0 0018 35.5a1 1 0 002 0 6 6 0 1112 0 1 1 0 002 0 8 8 0 00-4.7-7.28zM26 27.5a3 3 0 110-5.999 3 3 0 010 5.999zm10.91.5l.8-.79a1.004 1.004 0 00-1.42-1.42l-.79.8-.79-.8a1.004 1.004 0 00-1.42 1.42l.8.79-.8.79a1.002 1.002 0 00.325 1.639 1 1 0 001.095-.219l.79-.8.79.8a1.002 1.002 0 001.639-.325 1 1 0 00-.219-1.095l-.8-.79z"
        fill="#FF3F3F"
      />
    </Svg>
  );
}

export default HideThreadIcon;
