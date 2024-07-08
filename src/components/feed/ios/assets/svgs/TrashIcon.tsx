import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function TrashIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M13.333 4h-2.666v-.667a2 2 0 00-2-2H7.333a2 2 0 00-2 2V4H2.667a.667.667 0 000 1.333h.666v7.333a2 2 0 002 2h5.334a2 2 0 002-2V5.333h.666a.667.667 0 100-1.333zm-6.666-.667a.667.667 0 01.666-.667h1.334a.667.667 0 01.666.667V4H6.667v-.667zm4.666 9.333a.667.667 0 01-.666.667H5.333a.666.666 0 01-.666-.667V5.333h6.666v7.333z"
        fill="#000"
        opacity={0.4}
      />
    </Svg>
  );
}

export default TrashIcon;
