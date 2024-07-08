import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function LockIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12 13a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1zm5-4V7A5 5 0 007 7v2a3 3 0 00-3 3v7a3 3 0 003 3h10a3 3 0 003-3v-7a3 3 0 00-3-3zM9 7a3 3 0 116 0v2H9V7zm9 12a1 1 0 01-1 1H7a1 1 0 01-1-1v-7a1 1 0 011-1h10a1 1 0 011 1v7z"
        fill="#fff"
      />
    </Svg>
  );
}

export default LockIcon;
