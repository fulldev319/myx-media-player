import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function RightArrowIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M15.54 11.29L9.88 5.64a1 1 0 10-1.42 1.41l4.95 5L8.46 17a1 1 0 000 1.41 1 1 0 00.71.3.999.999 0 00.71-.3l5.66-5.65a1 1 0 000-1.47z"
        fill="#000"
        opacity={0.2}
      />
    </Svg>
  );
}

export default RightArrowIcon;
