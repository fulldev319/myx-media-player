import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width={4}
    height={16}
    viewBox="0 0 4 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M3.16683 1.99967C3.16683 1.35534 2.6445 0.833008 2.00016 0.833008C1.35583 0.833008 0.833496 1.35534 0.833496 1.99967C0.833496 2.64401 1.35583 3.16634 2.00016 3.16634C2.6445 3.16634 3.16683 2.64401 3.16683 1.99967Z"
      fill="white"
    />
    <Path
      d="M3.16683 7.99967C3.16683 7.35534 2.6445 6.83301 2.00016 6.83301C1.35583 6.83301 0.833496 7.35534 0.833496 7.99967C0.833496 8.64401 1.35583 9.16634 2.00016 9.16634C2.6445 9.16634 3.16683 8.64401 3.16683 7.99967Z"
      fill="white"
    />
    <Path
      d="M3.16683 13.9997C3.16683 13.3553 2.6445 12.833 2.00016 12.833C1.35583 12.833 0.833496 13.3553 0.833496 13.9997C0.833496 14.644 1.35583 15.1663 2.00016 15.1663C2.6445 15.1663 3.16683 14.644 3.16683 13.9997Z"
      fill="white"
    />
  </Svg>
);
export default SvgComponent;