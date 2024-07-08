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
        d="M10 18.8337C14.6024 18.8337 18.3333 15.1027 18.3333 10.5003C18.3333 5.89795 14.6024 2.16699 10 2.16699C5.39763 2.16699 1.66667 5.89795 1.66667 10.5003C1.66667 15.1027 5.39763 18.8337 10 18.8337Z"
        stroke="#010101"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 5.5V10.5L13.3333 12.1667"
        stroke="#010101"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);
export default SvgComponent;
