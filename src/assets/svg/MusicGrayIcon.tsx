import * as React from 'react';
import Svg, {Path, G} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <G opacity="0.4">
      <Path
        d="M7.5 15.5V4.66667L17.5 3V13.8333"
        stroke="#010101"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 18C6.38071 18 7.5 16.8807 7.5 15.5C7.5 14.1193 6.38071 13 5 13C3.61929 13 2.5 14.1193 2.5 15.5C2.5 16.8807 3.61929 18 5 18Z"
        stroke="#010101"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 16.333C16.3807 16.333 17.5 15.2137 17.5 13.833C17.5 12.4523 16.3807 11.333 15 11.333C13.6193 11.333 12.5 12.4523 12.5 13.833C12.5 15.2137 13.6193 16.333 15 16.333Z"
        stroke="#010101"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);
export default SvgComponent;
