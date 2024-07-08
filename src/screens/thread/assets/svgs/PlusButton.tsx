import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function PlusButton(props) {
  return (
    <Svg
      width={48}
      height={49}
      viewBox="0 0 48 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect
        y={0.480469}
        width={48}
        height={48}
        rx={24}
        fill="#fff"
        fillOpacity={0.1}
      />
      <Path
        d="M31 23.48h-6v-6a1 1 0 00-2 0v6h-6a1 1 0 100 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"
        fill="#fff"
        opacity={0.6}
      />
      <Rect
        x={0.5}
        y={0.980469}
        width={47}
        height={47}
        rx={23.5}
        stroke="#fff"
        strokeOpacity={0.4}
        strokeDasharray="5 5"
      />
    </Svg>
  );
}

export default PlusButton;
