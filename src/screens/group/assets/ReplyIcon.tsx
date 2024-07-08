import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ReplyIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8 1.333A6.666 6.666 0 001.333 8a6.594 6.594 0 001.507 4.22l-1.333 1.333a.667.667 0 00-.14.727.667.667 0 00.633.387h6A6.666 6.666 0 108 1.333zm0 12H3.607l.62-.62a.667.667 0 000-.94A5.333 5.333 0 118 13.334z"
        fill="#fff"
      />
    </Svg>
  );
}

export default ReplyIcon;
