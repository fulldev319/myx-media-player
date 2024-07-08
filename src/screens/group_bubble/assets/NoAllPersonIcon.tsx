import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function NoAllPersonIcon(props) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={20} cy={20} r={20} fill="#4D4D4D" />
      <Path
        d="M24 16l-8 8M16 16l8 8"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        opacity={0.01}
        d="M18.97 30.67h-2.78L15.73 32h-1.47l2.51-6.99h1.63L20.91 32h-1.48l-.46-1.33zm-.38-1.12l-1.01-2.92-1.01 2.92h2.02zm4.658-4.95V32h-1.4v-7.4h1.4zm2.783 0V32h-1.4v-7.4h1.4z"
        fill="#fff"
      />
    </Svg>
  );
}

export default NoAllPersonIcon;
