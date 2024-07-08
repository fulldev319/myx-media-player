import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function IssIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={12} cy={12} r={12} fill="#FFA51F" />
      <Path
        d="M17.171 12.614a.358.358 0 00-.027-.109.49.49 0 00-.044-.093.475.475 0 00-.055-.087l-.087-.07-.049-.05L8.88 7.57a.547.547 0 00-.545.949l6.267 3.616H7.364a.545.545 0 00-.546.546v2.182a1.636 1.636 0 001.637 1.636h7.09a1.636 1.636 0 001.637-1.636V12.68s-.011-.044-.011-.066zm-1.09 2.248a.545.545 0 01-.546.545h-7.08a.545.545 0 01-.546-.545v-1.637h8.182l-.01 1.637zm-1.637 0a.546.546 0 10-.202-.039c.068.027.14.04.213.039h-.011z"
        fill="#fff"
      />
    </Svg>
  );
}

export default IssIcon;
