import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function MessageIcon(props) {
  return (
    <Svg
      width={16}
      height={17}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8 1.813A6.667 6.667 0 001.333 8.48 6.593 6.593 0 002.84 12.7l-1.333 1.334a.667.667 0 00-.14.726.666.666 0 00.633.387h6A6.667 6.667 0 008 1.813zm0 12H3.607l.62-.62a.667.667 0 000-.94A5.334 5.334 0 118 13.814z"
        fill="#fff"
        fillOpacity={0.2}
      />
    </Svg>
  );
}

export default MessageIcon;
