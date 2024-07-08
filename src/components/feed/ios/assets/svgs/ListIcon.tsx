import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function ListIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G
        opacity={0.3}
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path d="M2 12h12M2 8h12M2 4h12" />
      </G>
    </Svg>
  );
}

export default ListIcon;
