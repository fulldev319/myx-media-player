import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ClockIcon(props) {
  return (
    <Svg
      width={16}
      height={17}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M7.333 1.813a6.667 6.667 0 100 13.334 6.667 6.667 0 000-13.334zm0 12a5.333 5.333 0 110-10.665 5.333 5.333 0 010 10.665zm0-9.333a.667.667 0 00-.666.667v2.946l-1.4.807a.667.667 0 00.333 1.247c.117 0 .232-.03.333-.087l1.734-1 .06-.06.106-.087a.574.574 0 00.067-.106.593.593 0 00.053-.114.434.434 0 00.034-.133L8 8.48V5.147a.667.667 0 00-.667-.667z"
        fill="#fff"
        fillOpacity={0.2}
      />
    </Svg>
  );
}

export default ClockIcon;
