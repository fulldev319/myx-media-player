import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <G
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      opacity="0.3">
      <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></Path>
      <Path d="M10 8l6 4-6 4V8z"></Path>
    </G>
  </Svg>
);
export default SvgComponent;
