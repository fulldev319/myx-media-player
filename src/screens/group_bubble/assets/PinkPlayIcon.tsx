import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

export const PinkPlayIcon = () => {
  return (
    <Svg width="40" height="40" fill="none" viewBox="0 0 40 40">
      <Circle cx="20" cy="20" r="20" fill="#9214F5"></Circle>
      <Path
        fill="#fff"
        d="M26.45 17.5l-8.05-4.617a2.85 2.85 0 00-4.275 2.5v9.267a2.85 2.85 0 004.275 2.467l8.05-4.617a2.852 2.852 0 000-4.933V17.5zm-.833 3.492l-8.05 4.683a1.2 1.2 0 01-1.183 0 1.184 1.184 0 01-.592-1.025v-9.3a1.184 1.184 0 01.592-1.025c.18-.1.384-.155.591-.158.207.004.41.058.592.158l8.05 4.65a1.183 1.183 0 010 2.05v-.033z"></Path>
    </Svg>
  );
};
