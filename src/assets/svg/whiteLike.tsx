import React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon() {
  return (
    <Svg width="18" height="16" fill="none" viewBox="0 0 18 16">
      <Path
        fill="#fff"
        d="M6 .688C3.197.688.937 2.989.937 5.811c0 2.681 1.413 6.683 6.641 9.134l.023.01c.284.134.485.228.787.296.348.077.876.077 1.224 0 .302-.068.503-.162.787-.295l.023-.011c5.228-2.451 6.64-6.453 6.64-9.134C17.063 2.99 14.803.687 12 .687c-1.123 0-2.161.371-3 .997a5.001 5.001 0 00-3-.996z"></Path>
    </Svg>
  );
}

export default Icon;
