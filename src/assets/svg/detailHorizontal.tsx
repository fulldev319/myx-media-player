import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width={22}
    height={4}
    viewBox="0 0 22 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M2 0.25C1.0335 0.25 0.25 1.0335 0.25 2C0.25 2.9665 1.0335 3.75 2 3.75C2.9665 3.75 3.75 2.9665 3.75 2C3.75 1.0335 2.9665 0.25 2 0.25Z"
      fill="white"
    />
    <Path
      d="M11 0.25C10.0335 0.25 9.25 1.0335 9.25 2C9.25 2.9665 10.0335 3.75 11 3.75C11.9665 3.75 12.75 2.9665 12.75 2C12.75 1.0335 11.9665 0.25 11 0.25Z"
      fill="white"
    />
    <Path
      d="M20 0.25C19.0335 0.25 18.25 1.0335 18.25 2C18.25 2.9665 19.0335 3.75 20 3.75C20.9665 3.75 21.75 2.9665 21.75 2C21.75 1.0335 20.9665 0.25 20 0.25Z"
      fill="white"
    />
  </Svg>
);

export default SvgComponent;
