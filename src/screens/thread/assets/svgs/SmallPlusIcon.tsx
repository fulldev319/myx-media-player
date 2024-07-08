import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function SmallPlusIcon(props) {
  return (
    <Svg
      width={42}
      height={41}
      viewBox="0 0 42 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect
        x={0.767151}
        width={40.4856}
        height={40.4856}
        rx={20.2428}
        fill="#fff"
        fillOpacity={0.1}
      />
      <Path
        d="M26.914 19.4h-5.06v-5.061a.843.843 0 10-1.688 0v5.06h-5.06a.843.843 0 100 1.687h5.06v5.06a.843.843 0 101.687 0v-5.06h5.06a.843.843 0 000-1.687z"
        fill="#fff"
        opacity={0.6}
      />
      <Rect
        x={1.18888}
        y={0.421725}
        width={39.6422}
        height={39.6422}
        rx={19.8211}
        stroke="#fff"
        strokeOpacity={0.4}
        strokeWidth={0.84345}
        strokeDasharray="4.22 4.22"
      />
    </Svg>
  );
}

export default SmallPlusIcon;
