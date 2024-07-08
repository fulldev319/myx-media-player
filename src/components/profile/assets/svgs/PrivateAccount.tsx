import * as React from 'react';
import Svg, {Circle, G, Path} from 'react-native-svg';

function PrivateAccountIcon(props) {
  return (
    <Svg
      width={100}
      height={100}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={50} cy={50} r={49.5} stroke="#fff" strokeOpacity={0.6} />
      <G
        opacity={0.6}
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path d="M61.667 48.334H38.333A3.333 3.333 0 0035 51.667v11.667a3.333 3.333 0 003.333 3.333h23.334A3.333 3.333 0 0065 63.334V51.667a3.333 3.333 0 00-3.333-3.333zM41.667 48.334v-6.667a8.333 8.333 0 0116.666 0v6.667" />
      </G>
    </Svg>
  );
}

export default PrivateAccountIcon;
