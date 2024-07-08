import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SearchIcon(props) {
  return (
    <Svg
      width={24}
      height={25}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M21.71 21.062L18 17.382a9 9 0 10-1.39 1.39l3.68 3.68a.999.999 0 001.42 0 1 1 0 000-1.39zM11 18.772a7 7 0 110-14 7 7 0 010 14z"
        fill="#BF76F9"
      />
    </Svg>
  );
}

export default SearchIcon;
