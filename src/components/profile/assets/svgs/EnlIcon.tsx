import * as React from 'react';
import Svg, {Circle, G, Path, Defs, ClipPath} from 'react-native-svg';

function EnlIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={12} cy={12} r={12} fill="#8210DC" />
      <G clipPath="url(#clip0_382_17322)">
        <Path
          d="M10.073 10.031v.002h-.002l.002-.002zm5.43-.101a.677.677 0 00-.126-.096.545.545 0 00-.763.225c-.188.37-.447.7-.762.97a4.753 4.753 0 00-2.327-4.96.546.546 0 00-.814.44 3.827 3.827 0 01-1.348 2.695l-.126.103c-.413.278-.78.62-1.084 1.015a4.9 4.9 0 001.994 7.587.545.545 0 00.724-.676 3.803 3.803 0 01-.104-1.408 4.91 4.91 0 002.353 2.191.543.543 0 00.39.021 4.906 4.906 0 001.993-8.107zm-2.13 6.998a3.797 3.797 0 01-1.95-2.4 4.865 4.865 0 01-.099-.527.545.545 0 00-1.013-.197 4.887 4.887 0 00-.658 2.573 3.81 3.81 0 01-.64-5.382c.238-.31.526-.579.851-.796a.4.4 0 00.04-.03l.168-.136a4.891 4.891 0 001.581-2.527 3.674 3.674 0 01.756 4.411.545.545 0 00.646.774 4.285 4.285 0 002.107-1.466 3.82 3.82 0 01-1.789 5.704z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_382_17322">
          <Path
            fill="#fff"
            transform="translate(5.455 5.453)"
            d="M0 0H13.0909V13.0909H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default EnlIcon;