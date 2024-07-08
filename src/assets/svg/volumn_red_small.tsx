import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg width="17" height="16" fill="none" viewBox="0 0 17 16">
    <Path
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M7.833 3.334L4.5 6.001H1.833v4H4.5l3.333 2.666V3.334zM13.213 3.287a6.667 6.667 0 010 9.427M10.86 5.64a3.333 3.333 0 010 4.714"
    />
  </Svg>
);
export default SvgComponent;
