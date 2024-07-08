import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SavedIcon(props) {
  return (
    <Svg width="26" height="24" fill="none" viewBox="0 0 26 24">
      <Path
        fill="#FF6651"
        d="M17.634 2H9.268c-.832 0-1.63.316-2.218.879A2.935 2.935 0 006.131 5v16c0 .176.047.35.14.502.091.153.223.28.383.368a1.082 1.082 0 001.046 0l5.751-3.18 5.752 3.18c.16.086.34.131.523.13.183.001.363-.044.523-.13.16-.088.292-.215.383-.368a.967.967 0 00.14-.502V5c0-.796-.331-1.559-.92-2.121A3.211 3.211 0 0017.634 2z"
      />
    </Svg>
  );
}

export default SavedIcon;
