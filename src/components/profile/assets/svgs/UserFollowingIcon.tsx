import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function UserFollowingIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8.867 8.147A3.28 3.28 0 0010 5.667a3.333 3.333 0 10-6.667 0 3.28 3.28 0 001.134 2.48 5.333 5.333 0 00-3.134 4.854.667.667 0 001.334 0 4 4 0 018 0A.667.667 0 1012 13a5.333 5.333 0 00-3.133-4.854zm-2.2-.48a2 2 0 110-4 2 2 0 010 4zm7.806-1.58a.667.667 0 00-.946 0l-1.334 1.334L11.78 7a.666.666 0 10-.947.94l.894.893a.667.667 0 00.94 0l1.78-1.78a.667.667 0 00.026-.967z"
        fill="#fff"
        opacity={0.4}
      />
    </Svg>
  );
}

export default UserFollowingIcon;
