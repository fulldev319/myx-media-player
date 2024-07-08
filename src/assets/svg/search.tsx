import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = ({isActive, isWhite = false}) => {
  const color = isWhite ? '#FFFFFF' : isActive ? '#f6943d' : '#A7A7A7';
  return (
    <Svg width={21} height={21} viewBox="0 0 21 21" fill="none">
      <Path
        d="M17.93 9.491C17.93 11.1704 17.432 12.812 16.499 14.2083C15.566 15.6047 14.2399 16.693 12.6884 17.3357C11.1368 17.9783 9.42958 18.1465 7.78249 17.8188C6.1354 17.4912 4.62245 16.6825 3.43496 15.495C2.24747 14.3076 1.43878 12.7946 1.11115 11.1475C0.783527 9.50042 0.951677 7.79316 1.59434 6.24164C2.237 4.69011 3.32532 3.36399 4.72165 2.43099C6.11799 1.49799 7.75964 1 9.439 1C11.691 1 13.8507 1.89458 15.443 3.48696C17.0354 5.07933 17.93 7.23905 17.93 9.491V9.491Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.053 20.105L15.436 15.488"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SvgComponent;
