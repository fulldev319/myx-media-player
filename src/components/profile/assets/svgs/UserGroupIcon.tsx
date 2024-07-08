import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function UserGroupIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8.2 8.147a3.28 3.28 0 001.133-2.48 3.333 3.333 0 10-6.666 0A3.28 3.28 0 003.8 8.147a5.333 5.333 0 00-3.133 4.854A.667.667 0 002 13a4 4 0 018 0 .667.667 0 001.333 0A5.333 5.333 0 008.2 8.147zM6 7.667a2 2 0 110-4 2 2 0 010 4zm6.493.214A3.334 3.334 0 0010 2.334a.667.667 0 000 1.333 2 2 0 012 2 2 2 0 01-1 1.727.667.667 0 00-.033 1.133l.26.174.086.046a4.667 4.667 0 012.667 4.254.667.667 0 001.333 0 6 6 0 00-2.82-5.12z"
        fill="#fff"
        opacity={0.4}
      />
    </Svg>
  );
}

export default UserGroupIcon;
