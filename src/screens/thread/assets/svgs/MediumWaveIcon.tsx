import * as React from 'react';
import Svg, {G, Rect} from 'react-native-svg';

function MediumWaveIcon(props) {
  return (
    <Svg
      width={16}
      height={14}
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G opacity={0.8} fill="#fff">
        <Rect
          x={0.997375}
          y={3.50488}
          width={2.10863}
          height={7.02875}
          rx={1.05431}
        />
        <Rect
          x={5.2146}
          y={0.693359}
          width={2.10863}
          height={12.6518}
          rx={1.05431}
        />
        <Rect
          x={9.43188}
          y={4.91016}
          width={2.10863}
          height={4.21725}
          rx={1.05431}
        />
        <Rect
          x={13.6491}
          y={3.50488}
          width={2.10863}
          height={7.02875}
          rx={1.05431}
        />
      </G>
    </Svg>
  );
}

export default MediumWaveIcon;
