import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ViewModeIcon(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M17.5 1.667h-15a.833.833 0 00-.833.833v15a.833.833 0 00.833.833h15a.833.833 0 00.833-.833v-15a.833.833 0 00-.833-.833zm-8.333 15H3.333v-3.334h5.834v3.334zm0-5H3.333V8.333h5.834v3.334zm7.5 5h-5.834v-3.334h5.834v3.334zm0-5h-5.834V8.333h5.834v3.334zm0-5H3.333V3.333h13.334v3.334z"
        fill="#BF76F9"
      />
    </Svg>
  );
}

export default ViewModeIcon;
