import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function SpinnerIcon(props) {
  return (
    <Svg
      width={73}
      height={72}
      viewBox="0 0 73 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M37 1a35 35 0 0126.601 57.746"
        stroke="#FF6651"
        strokeWidth={2}
      />
      <Rect
        x={1.5}
        y={1}
        width={70}
        height={70}
        rx={35}
        stroke="#F3F4F5"
        strokeWidth={2}
      />
    </Svg>
  );
}

export default SpinnerIcon;
