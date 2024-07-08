import * as React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Circle cx="12" cy="12.1582" r="12" fill="#FF6651" />
    <Path
      d="M17.3333 9L9.99999 16.3333L6.66666 13"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgComponent;
