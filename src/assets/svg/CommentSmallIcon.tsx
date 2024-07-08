import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg width="17" height="17" fill="none" viewBox="0 0 17 17">
    <Path
      stroke={props.isActive ? '#FF6651' : 'rgba(255, 255, 255, 0.4)'}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 8.167a5.587 5.587 0 01-.6 2.533 5.666 5.666 0 01-5.067 3.133 5.588 5.588 0 01-2.533-.6L2.25 14.5l1.267-3.8a5.586 5.586 0 01-.6-2.533A5.667 5.667 0 016.05 3.1a5.587 5.587 0 012.533-.6h.334a5.654 5.654 0 015.333 5.333v.334z"
    />
  </Svg>
);
export default SvgComponent;
