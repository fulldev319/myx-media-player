import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function PhotoIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M19 10a1 1 0 00-1 1v3.38l-1.48-1.48a2.79 2.79 0 00-3.93 0l-.7.71-2.48-2.49a2.79 2.79 0 00-3.93 0L4 12.61V7a1 1 0 011-1h8a1 1 0 100-2H5a3 3 0 00-3 3v12.22A2.79 2.79 0 004.78 22h12.44c.271-.002.54-.043.8-.12a2.74 2.74 0 002-2.65V11A1.001 1.001 0 0019 10zM5 20a1 1 0 01-1-1v-3.57l2.89-2.89a.78.78 0 011.1 0L15.46 20H5zm13-1a1 1 0 01-.18.54L13.3 15l.71-.7a.77.77 0 011.1 0L18 17.21V19zm3-15h-1V3a1 1 0 00-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 002 0V6h1a1 1 0 100-2z"
        fill="#9214F5"
      />
    </Svg>
  );
}

export default PhotoIcon;
