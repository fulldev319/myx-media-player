import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      opacity="0.4"
      d="M8 11V10C8 9.46957 7.78929 8.96086 7.41421 8.58579C7.03914 8.21071 6.53043 8 6 8H2.5C1.96957 8 1.46086 8.21071 1.08579 8.58579C0.710714 8.96086 0.5 9.46957 0.5 10V11"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      opacity="0.4"
      d="M4.25 6C5.35457 6 6.25 5.10457 6.25 4C6.25 2.89543 5.35457 2 4.25 2C3.14543 2 2.25 2.89543 2.25 4C2.25 5.10457 3.14543 6 4.25 6Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      opacity="0.4"
      d="M8.5 6L9.5 7L11.5 5"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgComponent;
