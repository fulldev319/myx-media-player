import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Rect width="20" height="20" rx="10" fill="#FF6651" />
    <Path
      d="M12.5 5.50015C12.6313 5.36883 12.7872 5.26466 12.9588 5.19359C13.1304 5.12252 13.3143 5.08594 13.5 5.08594C13.6857 5.08594 13.8696 5.12252 14.0412 5.19359C14.2128 5.26466 14.3687 5.36883 14.5 5.50015C14.6313 5.63147 14.7355 5.78737 14.8066 5.95895C14.8776 6.13054 14.9142 6.31443 14.9142 6.50015C14.9142 6.68587 14.8776 6.86977 14.8066 7.04135C14.7355 7.21293 14.6313 7.36883 14.5 7.50015L7.75 14.2502L5 15.0002L5.75 12.2502L12.5 5.50015Z"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);
export default SvgComponent;
