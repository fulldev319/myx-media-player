import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function MicIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12.747 6.08a.464.464 0 00-.467.467V7.6c0 2.36-1.92 4.28-4.28 4.28-2.36 0-4.28-1.92-4.28-4.28V6.54a.464.464 0 00-.467-.467.464.464 0 00-.466.467v1.053c0 2.714 2.086 4.947 4.746 5.187v1.42c0 .26.207.467.467.467s.467-.207.467-.467v-1.42a5.218 5.218 0 004.746-5.187V6.54a.471.471 0 00-.466-.46z"
        fill="#fff"
      />
      <Path
        d="M8 1.333A2.948 2.948 0 005.053 4.28v3.413a2.948 2.948 0 005.894 0V4.28A2.948 2.948 0 008 1.333zm.873 4.633a.384.384 0 01-.373.287c-.033 0-.067-.007-.1-.013a1.458 1.458 0 00-.793 0 .379.379 0 01-.474-.274.381.381 0 01.274-.473 2.29 2.29 0 011.2 0c.2.053.32.267.266.473zm.354-1.293a.387.387 0 01-.367.253.462.462 0 01-.133-.02 2.096 2.096 0 00-1.454 0 .393.393 0 01-.5-.233.383.383 0 01.234-.493 2.907 2.907 0 011.986 0c.2.073.307.293.234.493z"
        fill="#fff"
      />
    </Svg>
  );
}

export default MicIcon;
