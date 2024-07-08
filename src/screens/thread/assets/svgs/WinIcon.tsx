import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function WinIcon(props) {
  return (
    <Svg
      width={14}
      height={15}
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12.174 10.543l-1.58-2.73a4.083 4.083 0 10-7.187 0l-1.581 2.73a.583.583 0 00.507.875h1.675l.851 1.435c.029.047.064.09.105.128a.583.583 0 00.403.164h.081a.582.582 0 00.426-.286L7 10.922l1.126 1.954a.583.583 0 00.426.28h.081a.584.584 0 00.508-.286l.851-1.434h1.675a.584.584 0 00.507-.292.583.583 0 000-.601zm-6.813.893l-.52-.87a.584.584 0 00-.495-.286h-1.01l.835-1.446a4.083 4.083 0 002.082 1.073l-.892 1.528zM7 8.793A2.917 2.917 0 117 2.96a2.917 2.917 0 010 5.833zm2.654 1.488a.583.583 0 00-.496.285l-.519.87-.886-1.546a4.118 4.118 0 002.076-1.074l.834 1.447-1.009.018z"
        fill="#fff"
      />
    </Svg>
  );
}

export default WinIcon;