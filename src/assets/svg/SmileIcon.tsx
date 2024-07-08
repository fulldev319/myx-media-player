import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M7.99992 14.6668C11.6818 14.6668 14.6666 11.6821 14.6666 8.00016C14.6666 4.31826 11.6818 1.3335 7.99992 1.3335C4.31802 1.3335 1.33325 4.31826 1.33325 8.00016C1.33325 11.6821 4.31802 14.6668 7.99992 14.6668Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.33325 9.3335C5.33325 9.3335 6.33325 10.6668 7.99992 10.6668C9.66659 10.6668 10.6666 9.3335 10.6666 9.3335"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 6H6.00667"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 6H10.0067"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgComponent;
