import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function BackIcon(props) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M25 19h-7.59l3.3-3.29a1.004 1.004 0 10-1.42-1.42l-5 5a1.001 1.001 0 00-.21.33 1 1 0 000 .76 1 1 0 00.21.33l5 5a.999.999 0 001.42 0 1 1 0 000-1.42L17.41 21H25a1 1 0 100-2z"
        fill="#fff"
      />
      <Rect
        x={0.5}
        y={0.5}
        width={39}
        height={39}
        rx={19.5}
        stroke="#fff"
        strokeOpacity={0.2}
      />
    </Svg>
  );
}

export default BackIcon;
