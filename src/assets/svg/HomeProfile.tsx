import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width={64}
    height={14}
    viewBox="0 0 64 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={64} height={4} rx={2} fill="#4D4D4D" />
    <Rect y={10} width={64} height={4} rx={2} fill="#4D4D4D" />
  </Svg>
);

export default SvgComponent;
