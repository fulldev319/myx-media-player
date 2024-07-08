import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function Icon(props) {
  return (
    <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <G fill={props.color ? props.color : '#fff'} opacity="0.6">
        <Path d="M9.167 2a1.167 1.167 0 10-2.334 0 1.167 1.167 0 002.334 0zM9.167 8a1.167 1.167 0 10-2.334 0 1.167 1.167 0 002.334 0zM9.167 14a1.167 1.167 0 10-2.334 0 1.167 1.167 0 002.334 0z"></Path>
      </G>
    </Svg>
  );
}

export default Icon;
