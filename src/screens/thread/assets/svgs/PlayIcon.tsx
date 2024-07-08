import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function PlayIcon(props) {
  return (
    <Svg width="19" height="19" fill="none" viewBox="0 0 19 19">
      <Rect
        width="18.202"
        height="18.202"
        x="0.582"
        y="0.129"
        fill="#fff"
        fillOpacity="0.2"
        rx="9.101"
      />
      <Path
        fill="#fff"
        d="M12.163 8.093L8.5 5.993A1.297 1.297 0 006.554 7.13v4.217A1.297 1.297 0 008.5 12.469l3.663-2.1a1.296 1.296 0 000-2.246v-.03zm-.38 1.589l-3.663 2.13a.545.545 0 01-.538 0 .538.538 0 01-.27-.465V7.115a.538.538 0 01.808-.467l3.664 2.116a.539.539 0 010 .933v-.015z"
      />
    </Svg>
  );
}

export default PlayIcon;
