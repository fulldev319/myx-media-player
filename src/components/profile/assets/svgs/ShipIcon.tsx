import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function ShipIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={12} cy={12} r={12} fill="#098FAD" />
      <Path
        d="M15.818 12.544h-1.09a.545.545 0 100 1.09h.496a3.273 3.273 0 01-2.679 2.679v-4.86h.546a.545.545 0 100-1.091h-.546v-.644a1.636 1.636 0 10-1.09 0v.644h-.546a.545.545 0 000 1.09h.545v4.86a3.272 3.272 0 01-2.678-2.677h.497a.545.545 0 000-1.091H8.182a.545.545 0 00-.546.545 4.364 4.364 0 008.728 0 .545.545 0 00-.546-.545zM12 8.725a.546.546 0 110-1.09.546.546 0 010 1.09z"
        fill="#fff"
      />
    </Svg>
  );
}

export default ShipIcon;
