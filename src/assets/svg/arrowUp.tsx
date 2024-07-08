import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon({color = '#fff'}) {
  return (
    <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M8.431 5.41a.5.5 0 00-.53 0L2.568 8.742a.5.5 0 10.53.848l5.068-3.168 5.069 3.168a.5.5 0 10.53-.848L8.43 5.409z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default Icon;
