import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="18"
    height="19"
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M0 8.5C0 7.39543 0.895431 6.5 2 6.5C3.10457 6.5 4 7.39543 4 8.5V18.5H0V8.5Z"
      fill="#FF6651"
    />
    <Path
      d="M7 2.5C7 1.39543 7.89543 0.5 9 0.5C10.1046 0.5 11 1.39543 11 2.5V18.5H7V2.5Z"
      fill="#FF6651"
    />
    <Path
      d="M14 4.5C14 3.39543 14.8954 2.5 16 2.5C17.1046 2.5 18 3.39543 18 4.5V18.5H14V4.5Z"
      fill="#FF6651"
    />
  </Svg>
);
export default SvgComponent;
