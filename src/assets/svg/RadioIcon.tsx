import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M12 14.5C13.1046 14.5 14 13.6046 14 12.5C14 11.3954 13.1046 10.5 12 10.5C10.8954 10.5 10 11.3954 10 12.5C10 13.6046 10.8954 14.5 12 14.5Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.2401 8.25969C16.7979 8.81693 17.2405 9.47866 17.5424 10.207C17.8444 10.9354 17.9998 11.7162 17.9998 12.5047C17.9998 13.2932 17.8444 14.0739 17.5424 14.8023C17.2405 15.5307 16.7979 16.1924 16.2401 16.7497M7.76006 16.7397C7.2022 16.1824 6.75965 15.5207 6.4577 14.7923C6.15576 14.0639 6.00034 13.2832 6.00034 12.4947C6.00034 11.7062 6.15576 10.9254 6.4577 10.197C6.75965 9.46866 7.2022 8.80693 7.76006 8.24969M19.0701 5.42969C20.9448 7.30496 21.9979 9.84805 21.9979 12.4997C21.9979 15.1513 20.9448 17.6944 19.0701 19.5697M4.93006 19.5697C3.05535 17.6944 2.0022 15.1513 2.0022 12.4997C2.0022 9.84805 3.05535 7.30496 4.93006 5.42969"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgComponent;