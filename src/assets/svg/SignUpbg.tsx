import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const SignUpBg = props => (
  <Svg
    width={278}
    height={285}
    viewBox="0 0 278 285"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G opacity={0.7} fill="#fff">
      <Path
        opacity={0.06}
        d="M.5 555C153.759 555 278 430.759 278 277.5 278 124.241 153.759 0 .5 0-152.759 0-277 124.241-277 277.5-277 430.759-152.759 555 .5 555z"
      />
      <Path
        opacity={0.06}
        d="M.5 436C88.037 436 159 365.037 159 277.5S88.037 119 .5 119-158 189.963-158 277.5-87.037 436 .5 436z"
      />
      <Path
        opacity={0.06}
        d="M.5 322c24.577 0 44.5-19.923 44.5-44.5S25.077 233 .5 233-44 252.923-44 277.5-24.077 322 .5 322z"
      />
    </G>
  </Svg>
);

export default SignUpBg;
