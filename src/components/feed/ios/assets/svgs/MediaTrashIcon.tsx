import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function MediaTrashIcon(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={20} height={20} rx={10} fill="#fff" />
      <Path
        d="M14 7h-2v-.5A1.5 1.5 0 0010.5 5h-1A1.5 1.5 0 008 6.5V7H6a.5.5 0 100 1h.5v5.5A1.5 1.5 0 008 15h4a1.5 1.5 0 001.5-1.5V8h.5a.5.5 0 000-1zm-5-.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5V7H9v-.5zm3.5 7a.5.5 0 01-.5.5H8a.5.5 0 01-.5-.5V8h5v5.5z"
        fill="#000"
      />
    </Svg>
  );
}

export default MediaTrashIcon;
