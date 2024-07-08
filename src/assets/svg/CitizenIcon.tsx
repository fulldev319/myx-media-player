import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CitizenIcon(props) {
  return (
    <Svg
      width={17}
      height={16}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8.7 8.146a3.28 3.28 0 001.133-2.48 3.333 3.333 0 00-6.667 0A3.28 3.28 0 004.3 8.146 5.333 5.333 0 001.167 13 .667.667 0 102.5 13a4 4 0 018 0 .667.667 0 001.333 0A5.333 5.333 0 008.7 8.146zm-2.2-.48a2 2 0 110-4 2 2 0 010 4zm6.493.214A3.334 3.334 0 0010.5 2.333a.667.667 0 000 1.333 2 2 0 012 2 2 2 0 01-1 1.727.666.666 0 00-.034 1.133l.26.174.087.046A4.667 4.667 0 0114.48 13a.667.667 0 001.333 0 6 6 0 00-2.82-5.12z"
        fill="#fff"
      />
    </Svg>
  );
}

export default CitizenIcon;
