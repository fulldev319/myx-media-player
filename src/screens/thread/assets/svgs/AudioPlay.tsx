import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function AudioPlay(props) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={48} height={48} rx={24} fill="#FF6651" />
      <Path
        d="M32.04 21l-9.66-5.54a3.419 3.419 0 00-5.13 3v11.12a3.42 3.42 0 005.13 2.96L32.04 27a3.42 3.42 0 000-5.92V21zm-1 4.19l-9.66 5.62a1.44 1.44 0 01-1.42 0 1.42 1.42 0 01-.71-1.23V18.42a1.419 1.419 0 01.71-1.23 1.51 1.51 0 01.71-.19c.248.005.492.07.71.19l9.66 5.58a1.42 1.42 0 010 2.46v-.04z"
        fill="#fff"
      />
    </Svg>
  );
}

export default AudioPlay;
