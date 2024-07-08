import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function ThreeDotIcon(props) {
  return (
    <Svg
      width={20}
      height={21}
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G
        opacity={0.4}
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path d="M15.833 11.314a.833.833 0 100-1.667.833.833 0 000 1.667zM10 11.314a.833.833 0 100-1.667.833.833 0 000 1.667zM4.167 11.314a.833.833 0 100-1.667.833.833 0 000 1.667z" />
      </G>
    </Svg>
  );
}

export default ThreeDotIcon;
