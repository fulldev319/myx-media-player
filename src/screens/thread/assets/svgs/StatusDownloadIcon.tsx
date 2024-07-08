import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function StatusDownloadIcon(props) {
  return (
    <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <Path
        fill="#FF6651"
        d="M6.908 11.075a.834.834 0 000 1.184l2.5 2.5a.833.833 0 001.184 0l2.5-2.5a.837.837 0 00-1.184-1.184l-1.075 1.084V2.5a.834.834 0 00-1.666 0v9.659l-1.075-1.084a.833.833 0 00-1.184 0zM15 7.5h-1.667a.833.833 0 000 1.667H15a.833.833 0 01.833.833v5.834a.834.834 0 01-.833.833H5a.833.833 0 01-.833-.833V10A.833.833 0 015 9.167h1.667a.833.833 0 100-1.667H5A2.5 2.5 0 002.5 10v5.834a2.5 2.5 0 002.5 2.5h10a2.5 2.5 0 002.5-2.5V10A2.5 2.5 0 0015 7.5z"
      />
    </Svg>
  );
}

export default StatusDownloadIcon;
