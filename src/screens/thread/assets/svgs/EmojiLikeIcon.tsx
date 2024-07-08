import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function EmojiLikeIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M5.613 8.14a.667.667 0 00.474.193.667.667 0 00.473-.193l1-1a.666.666 0 000-.947l-1-1a.67.67 0 10-.947.947l.527.526-.527.527a.667.667 0 000 .947zm3.96 1.333a2.507 2.507 0 01-3.146 0 .667.667 0 10-.854 1.027 3.787 3.787 0 004.854 0 .668.668 0 00-.854-1.027zM10 6a.667.667 0 100 1.333A.667.667 0 0010 6zM8 1.333a6.667 6.667 0 100 13.333A6.667 6.667 0 008 1.333zm0 12A5.334 5.334 0 118 2.666a5.334 5.334 0 010 10.667z"
        fill="#fff"
      />
    </Svg>
  );
}

export default EmojiLikeIcon;
