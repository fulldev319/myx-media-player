import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="44" height="44" fill="none" viewBox="0 0 44 44">
      <Rect width="44" height="44" fill="#fff" rx="22"></Rect>
      <Path
        fill="#000"
        d="M29.863 14.152a1.611 1.611 0 00-1.61-.42L14.84 17.633a1.6 1.6 0 00-1.153 1.268c-.118.625.295 1.42.835 1.752l4.195 2.578c.43.264.985.198 1.341-.161l4.803-4.833a.612.612 0 01.883 0 .636.636 0 010 .89l-4.81 4.833a1.103 1.103 0 00-.162 1.349l2.563 4.236c.3.503.817.788 1.384.788.067 0 .142 0 .208-.008a1.625 1.625 0 001.36-1.158l3.976-13.396a1.637 1.637 0 00-.4-1.62z"></Path>
    </Svg>
  );
}

export default Icon;
