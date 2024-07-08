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
      <Path d="M3 18v-6a9 9 0 1118 0v6"></Path>
      <Path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z"></Path>
    </G>
  </Svg>
);
export default SvgComponent;
