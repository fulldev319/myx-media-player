import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = ({isActive}) => {
  const color = isActive ? '#f6943d' : '#A7A7A7';
  return (
    <Svg
      width={20}
      height={19}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      >
      <Path d="M5.75 0.967041V17.967" stroke={color} strokeLinecap="round" />
      <Path d="M1 0.967041V17.967" stroke={color} strokeLinecap="round" />
      <Path d="M10.5 2.10608L19 16.8285" stroke={color} strokeLinecap="round" />
    </Svg>
  )
};

export default SvgComponent;
