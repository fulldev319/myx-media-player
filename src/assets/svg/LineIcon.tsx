import * as React from 'react';
import Svg, {Line} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width={1}
    height={12}
    viewBox="0 0 1 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Line opacity="0.3" x1="0.5" y1="2.18557e-08" x2="0.499999" y2="12" stroke="white"/>
  </Svg>
);
export default SvgComponent;
