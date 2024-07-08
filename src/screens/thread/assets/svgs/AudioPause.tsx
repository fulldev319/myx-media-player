import * as React from 'react';
import Svg, {G, Rect, Path, Defs} from 'react-native-svg';

function AudioPause(props) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G filter="url(#filter0_b_207_4098)" fill="#fff">
        <Rect width={48} height={48} rx={24} fillOpacity={0.2} />
        <Path d="M28 14a3 3 0 00-3 3v14a3 3 0 106 0V17a3 3 0 00-3-3zm1 17a1 1 0 01-2 0V17a1 1 0 112 0v14zm-9-17a3 3 0 00-3 3v14a3 3 0 106 0V17a3 3 0 00-3-3zm1 17a1 1 0 01-2 0V17a1 1 0 112 0v14z" />
      </G>
      <Defs></Defs>
    </Svg>
  );
}

export default AudioPause;
