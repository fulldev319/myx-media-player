import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function DownloadIcon(props) {
  return (
    <Svg
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9.192 13.29a1 1 0 000 1.42l3 3a1 1 0 001.42 0l3-3a1.004 1.004 0 10-1.42-1.42l-1.29 1.3V3a1 1 0 00-2 0v11.59l-1.29-1.3a1.001 1.001 0 00-1.42 0zM18.902 9h-2a1 1 0 100 2h2a1 1 0 011 1v7a1 1 0 01-1 1h-12a1 1 0 01-1-1v-7a1 1 0 011-1h2a1 1 0 000-2h-2a3 3 0 00-3 3v7a3 3 0 003 3h12a3 3 0 003-3v-7a3 3 0 00-3-3z"
        fill="#fff"
      />
    </Svg>
  );
}

export default DownloadIcon;
