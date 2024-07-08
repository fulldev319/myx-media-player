import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.333 2.5H2.5v5.833h5.833V2.5zM17.5 2.5h-5.833v5.833H17.5V2.5zM17.5 11.667h-5.833V17.5H17.5v-5.833zM8.333 11.667H2.5V17.5h5.833v-5.833z"></Path>
    </Svg>
  );
}

export default Icon;
