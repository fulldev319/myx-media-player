import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M13.7263 8.93992L8.94634 13.7199C8.82251 13.8439 8.67546 13.9422 8.51359 14.0093C8.35173 14.0764 8.17823 14.111 8.00301 14.111C7.82779 14.111 7.65428 14.0764 7.49242 14.0093C7.33056 13.9422 7.1835 13.8439 7.05967 13.7199L1.33301 7.99992V1.33325H7.99967L13.7263 7.05992C13.9747 7.30973 14.1141 7.64767 14.1141 7.99992C14.1141 8.35217 13.9747 8.6901 13.7263 8.93992V8.93992Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.66699 4.66675H4.67366"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgComponent;
