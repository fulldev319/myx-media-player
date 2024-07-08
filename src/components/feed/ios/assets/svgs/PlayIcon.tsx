import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function PlayIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={32} height={32} rx={16} fill="#FF6651" />
      <Path
        d="M21.36 14l-6.44-3.694a2.28 2.28 0 00-3.42 2v7.414a2.28 2.28 0 003.42 1.973L21.36 18a2.28 2.28 0 000-3.947V14zm-.667 2.793l-6.44 3.747a.96.96 0 01-.946 0 .947.947 0 01-.474-.82v-7.44a.947.947 0 01.947-.947c.166.004.328.047.473.127l6.44 3.72a.945.945 0 010 1.64v-.027z"
        fill="#fff"
      />
    </Svg>
  );
}

export default PlayIcon;
