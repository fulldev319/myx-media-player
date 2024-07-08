import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function FlagIcon(props) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12 30v-7M12 23s1-1 4-1 5 2 8 2 4-1 4-1V11s-1 1-4 1-5-2-8-2-4 1-4 1v12z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FlagIcon;
