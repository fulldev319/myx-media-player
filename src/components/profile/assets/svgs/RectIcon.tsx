import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function RectIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={12} cy={12} r={12} fill="#F514B5" />
      <Path
        d="M16.364 11.1L13.21 7.058a1.67 1.67 0 00-2.438.033L7.636 11.1c-.173.268-.266.58-.267.9.01.306.102.604.267.861l.033.039 3.131 4.042a1.637 1.637 0 001.2.512 1.669 1.669 0 001.233-.545l3.13-4.01a1.637 1.637 0 00-.032-1.8h.033zm-.857 1.167l-3.092 3.938a.605.605 0 01-.775.038l-3.104-3.987A.545.545 0 018.46 12c0-.085.02-.169.055-.246l3.092-3.938a.606.606 0 01.775-.038l3.07 3.97c.057.088.088.19.088.295a.605.605 0 01-.054.224h.021z"
        fill="#fff"
      />
    </Svg>
  );
}

export default RectIcon;
