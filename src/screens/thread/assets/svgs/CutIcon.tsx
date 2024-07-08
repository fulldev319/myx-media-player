import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function CutIcon(props) {
  return (
    <Svg width="17" height="17" fill="none" viewBox="0 0 17 17">
      <G
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        opacity="0.4">
        <Path d="M4.5 14.48a2 2 0 100-4 2 2 0 000 4zM4.5 6.48a2 2 0 100-4 2 2 0 000 4zM13.834 3.146l-7.92 7.92M10.146 10.135l3.687 3.68M5.914 5.895L8.5 8.48" />
      </G>
    </Svg>
  );
}

export default CutIcon;
