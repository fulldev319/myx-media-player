import * as React from 'react';
import Svg, {Path, G, Rect, Defs, ClipPath} from 'react-native-svg';

function DownloadingIcon(props) {
  return (
    <Svg width="21" height="20" fill="none" viewBox="0 0 21 20">
      <Rect width="18" height="18" x="1.902" y="1" fill="#EA9B02" rx="9" />
      <G clipPath="url(#clip0_17189_53868)">
        <Path
          fill="#fff"
          d="M12.152 9.583h-.833V7.916a.417.417 0 00-.833 0V10a.417.417 0 00.416.416h1.25a.417.417 0 100-.833zm-1.25-3.75a4.167 4.167 0 100 8.333 4.167 4.167 0 000-8.333zm0 7.5a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666z"
        />
      </G>
      <Rect
        width="18"
        height="18"
        x="1.902"
        y="1"
        stroke="#010101"
        strokeWidth="2"
        rx="9"
      />
      <Defs>
        <ClipPath id="clip0_17189_53868">
          <Path fill="#fff" d="M0 0H10V10H0z" transform="translate(5.902 5)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default DownloadingIcon;
