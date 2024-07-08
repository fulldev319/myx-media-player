import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <G
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      opacity="0.4">
      <Path d="M15 7h3a5 5 0 110 10h-3m-6 0H6A5 5 0 116 7h3M8 12h8"></Path>
    </G>
  </Svg>
);
export default SvgComponent;
