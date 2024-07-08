import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="140" height="140" fill="none" viewBox="0 0 140 140">
      <Circle
        cx="70"
        cy="70"
        r="69.5"
        fill="#4FDE65"
        fillOpacity="0.22"
        stroke="#fff"></Circle>
      <Circle cx="69.5" cy="69.5" r="59" fill="#4FDE65" stroke="#fff"></Circle>
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M53.906 65.826l9.355 10.971 27.334-32.912c2.046-2.224 5.262.148 3.654 2.668l-26.895 41.66c-2.047 2.668-4.824 2.965-7.163.296L46.597 72.053c-2.63-3.855 4.093-9.34 7.309-6.227z"
        clipRule="evenodd"></Path>
    </Svg>
  );
}

export default Icon;
