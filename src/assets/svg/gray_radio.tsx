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
      <Path d="M12 14a2 2 0 100-4 2 2 0 000 4zM16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"></Path>
    </G>
  </Svg>
);
export default SvgComponent;
