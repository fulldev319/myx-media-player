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
      d="M1.33325 2H5.33325C6.0405 2 6.71877 2.28095 7.21887 2.78105C7.71897 3.28115 7.99992 3.95942 7.99992 4.66667V14C7.99992 13.4696 7.7892 12.9609 7.41413 12.5858C7.03906 12.2107 6.53035 12 5.99992 12H1.33325V2Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.6667 2H10.6667C9.95942 2 9.28115 2.28095 8.78105 2.78105C8.28095 3.28115 8 3.95942 8 4.66667V14C8 13.4696 8.21071 12.9609 8.58579 12.5858C8.96086 12.2107 9.46957 12 10 12H14.6667V2Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgComponent;
