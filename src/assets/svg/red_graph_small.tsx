import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg width="18" height="19" fill="none" viewBox="0 0 18 19">
    <Path
      fill="#FF6651"
      d="M0 8.5a2 2 0 114 0v10H0v-10zM7 2.5a2 2 0 114 0v16H7v-16zM14 4.5a2 2 0 114 0v14h-4v-14z"></Path>
  </Svg>
);
export default SvgComponent;
