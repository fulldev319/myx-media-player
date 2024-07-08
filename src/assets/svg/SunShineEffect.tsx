import * as React from 'react';
import Svg, {Circle} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="50"
    height="49"
    viewBox="0 0 50 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Circle
      opacity="0.2"
      cx="25"
      cy="24.5"
      r="21.5"
      transform="rotate(-180 25 24.5)"
      fill="white"
      fillOpacity="0.01"
      stroke="white"
      strokeWidth="6"
      strokeDasharray="1 4"
    />
  </Svg>
);
export default SvgComponent;
