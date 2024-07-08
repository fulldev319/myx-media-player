import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const WhiteSendIcon = props => (
  <Svg width="18" height="18" fill="none" viewBox="0 0 18 18">
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 .75A2.25 2.25 0 006.75 3v6a2.25 2.25 0 004.5 0V3A2.25 2.25 0 009 .75v0z"></Path>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 7.5V9a5.25 5.25 0 11-10.5 0V7.5M9 14.25v3M6 17.25h6"></Path>
  </Svg>
);

export default WhiteSendIcon;
