import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M5.6665 0.875C2.55182 0.875 0.0415039 3.43255 0.0415039 6.56927C0.0415039 9.54791 1.6113 13.9938 7.41996 16.7178L7.44507 16.7296C7.76089 16.8778 7.98403 16.9824 8.32015 17.0573C8.70601 17.1433 9.29366 17.1433 9.67952 17.0573C10.0156 16.9824 10.2388 16.8778 10.5546 16.7296L10.5797 16.7178C16.3884 13.9938 17.9582 9.5479 17.9582 6.56927C17.9582 3.43255 15.4479 0.875 12.3332 0.875C11.0852 0.875 9.93198 1.28698 8.99984 1.98211C8.0677 1.28698 6.91449 0.875 5.6665 0.875Z"
      stroke={props.isLiked ? 'transparent' : 'white'}
      fill={props.isLiked ? '#FF3F3F' : 'transparent'}
    />
  </Svg>
);
export default SvgComponent;
