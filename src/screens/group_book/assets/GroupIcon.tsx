import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function GroupIcon(props) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M20.3 20.22A4.92 4.92 0 0022 16.5a5 5 0 10-10 0 4.92 4.92 0 001.7 3.72A8 8 0 009 27.5a1 1 0 102 0 6 6 0 1112 0 1 1 0 002 0 8 8 0 00-4.7-7.28zM17 19.5a3 3 0 110-5.999 3 3 0 010 5.999zm9.74.32A5 5 0 0023 11.5a1 1 0 000 2 3 3 0 013 3 3 3 0 01-1.5 2.59 1 1 0 00-.05 1.7l.39.26.13.07a7 7 0 014 6.38 1 1 0 002 0 9 9 0 00-4.23-7.68z"
        fill="#000"
      />
    </Svg>
  );
}

export default GroupIcon;
