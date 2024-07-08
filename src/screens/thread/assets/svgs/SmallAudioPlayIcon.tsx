import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SmallAudioPlayIcon(props) {
  return (
    <Svg
      width={12}
      height={13}
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9.27 4.98L4.44 2.21a1.71 1.71 0 00-2.565 1.5v5.56a1.71 1.71 0 002.565 1.48l4.83-2.77a1.71 1.71 0 000-2.96v-.04zm-.5 2.096l-4.83 2.81a.72.72 0 01-.71 0 .71.71 0 01-.355-.615V3.69a.71.71 0 011.065-.615l4.83 2.79a.71.71 0 010 1.23v-.02z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SmallAudioPlayIcon;
