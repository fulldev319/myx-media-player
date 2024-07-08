import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M12.5 1C11.7044 1 10.9413 1.31607 10.3787 1.87868C9.81607 2.44129 9.5 3.20435 9.5 4V12C9.5 12.7956 9.81607 13.5587 10.3787 14.1213C10.9413 14.6839 11.7044 15 12.5 15C13.2956 15 14.0587 14.6839 14.6213 14.1213C15.1839 13.5587 15.5 12.7956 15.5 12V4C15.5 3.20435 15.1839 2.44129 14.6213 1.87868C14.0587 1.31607 13.2956 1 12.5 1V1Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.5 10V12C19.5 13.8565 18.7625 15.637 17.4497 16.9497C16.137 18.2625 14.3565 19 12.5 19C10.6435 19 8.86301 18.2625 7.55025 16.9497C6.2375 15.637 5.5 13.8565 5.5 12V10"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.5 19V23"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 23H16.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgComponent;
