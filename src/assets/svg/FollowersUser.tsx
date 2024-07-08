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
      d="M8.5 11V10C8.5 9.46957 8.28929 8.96086 7.91421 8.58579C7.53914 8.21071 7.03043 8 6.5 8H2.5C1.96957 8 1.46086 8.21071 1.08579 8.58579C0.710714 8.96086 0.5 9.46957 0.5 10V11"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      opacity="0.4"
      d="M4.5 6C5.60457 6 6.5 5.10457 6.5 4C6.5 2.89543 5.60457 2 4.5 2C3.39543 2 2.5 2.89543 2.5 4C2.5 5.10457 3.39543 6 4.5 6Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      opacity="0.4"
      d="M11.5 11.0004V10.0004C11.4997 9.55729 11.3522 9.12682 11.0807 8.77659C10.8092 8.42636 10.4291 8.17621 10 8.06543"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      opacity="0.4"
      d="M8 2.06543C8.43021 2.17558 8.81152 2.42578 9.08382 2.77658C9.35612 3.12739 9.50392 3.55884 9.50392 4.00293C9.50392 4.44701 9.35612 4.87847 9.08382 5.22927C8.81152 5.58008 8.43021 5.83028 8 5.94043"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgComponent;
