import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg width="17" height="17" fill="none" viewBox="0 0 17 17">
    <Path
      stroke={props.isActive ? '#FF6651' : 'rgba(255, 255, 255, 0.4)'}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.75 15.167a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333z"
    />
    <Path
      stroke={props.isActive ? '#FF6651' : 'rgba(255, 255, 255, 0.4)'}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.083 9.834s1 1.333 2.667 1.333c1.666 0 2.666-1.333 2.666-1.333M6.75 6.5h.007M10.75 6.5h.007"
    />
  </Svg>
);
export default SvgComponent;
