import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <Path
        fill="#fff"
        d="M8.5 1.4a.5.5 0 00-1 0v6.1H1.4a.5.5 0 000 1h6.1v6.1a.5.5 0 001 0V8.5h6.1a.5.5 0 000-1H8.5V1.4z"></Path>
    </Svg>
  );
}

export default Icon;
