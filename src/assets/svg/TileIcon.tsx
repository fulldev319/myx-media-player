import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M8.33333 2.5H2.5V8.33333H8.33333V2.5Z"
      stroke={props.clicked ? "#fff" : "#ffffff40"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.4998 2.5H11.6665V8.33333H17.4998V2.5Z"
      stroke={props.clicked ? "#fff" : "#ffffff40"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.4998 11.667H11.6665V17.5003H17.4998V11.667Z"
      stroke={props.clicked ? "#fff" : "#ffffff40"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.33333 11.667H2.5V17.5003H8.33333V11.667Z"
      stroke={props.clicked ? "#fff" : "#ffffff40"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgComponent;
