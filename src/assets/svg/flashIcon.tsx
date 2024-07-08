import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="46" height="46" fill="none" viewBox="0 0 46 46">
      <Circle cx="23" cy="23" r="23" fill="#010101" fillOpacity="0.56" />
      <Path
        fill="#fff"
        d="M29.558 20.167a.833.833 0 00-.725-.5h-3.816l1.058-3.95a.835.835 0 00-.433-.964.832.832 0 00-.367-.086h-5.833a.833.833 0 00-.834.616l-2.233 8.334a.833.833 0 00.808 1.05h3.225L18.9 30.283a.832.832 0 001.425.775l9.083-10a.833.833 0 00.15-.891zM21.4 27.4l.892-3.333a.833.833 0 00-.8-1.05h-3.2l1.783-6.684h4.108l-1.058 3.95a.832.832 0 00.833 1.05h2.975L21.4 27.4z"
      />
    </Svg>
  );
}

export default Icon;
