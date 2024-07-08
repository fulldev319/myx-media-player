import * as React from 'react';
import Svg, {Path, ClipPath, Defs, Rect, G} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <G clipPath="url(#clip0_15136_22391)">
      <Path
        d="M0.833008 3.33301V8.33301H5.83301"
        stroke="#FF6651"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.167 16.667V11.667H14.167"
        stroke="#FF6651"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.0747 7.49998C16.652 6.30564 15.9337 5.23782 14.9868 4.39616C14.0398 3.55451 12.8951 2.96645 11.6594 2.68686C10.4238 2.40727 9.13738 2.44527 7.92035 2.79729C6.70332 3.14932 5.5953 3.80391 4.69967 4.69998L0.833008 8.33331M19.1663 11.6666L15.2997 15.3C14.4041 16.1961 13.296 16.8506 12.079 17.2027C10.862 17.5547 9.5756 17.5927 8.33991 17.3131C7.10423 17.0335 5.95951 16.4455 5.01256 15.6038C4.06562 14.7621 3.34731 13.6943 2.92467 12.5"
        stroke="#FF6651"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_15136_22391">
        <Rect width="20" height="20" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
