import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <Path
      fill="#FF3F3F"
      d="M6.667 1.875c-3.115 0-5.625 2.558-5.625 5.694 0 2.979 1.57 7.425 7.378 10.149l.025.012c.316.148.54.252.875.327.386.086.974.086 1.36 0 .336-.075.559-.18.875-.327l.025-.012c5.809-2.724 7.378-7.17 7.378-10.149 0-3.136-2.51-5.694-5.625-5.694A5.557 5.557 0 0010 2.982a5.557 5.557 0 00-3.333-1.107z"
    />
  </Svg>
);
export default SvgComponent;
