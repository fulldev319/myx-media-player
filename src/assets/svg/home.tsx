import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = ({isActive}) => {
  const color = isActive ? '#f6943d' : '#A7A7A7';
  return (
    <Svg width={19} height={22} viewBox="0 0 19 22" fill="#f0f">
      <Path
        d="M6.67 21.1V13.012H12.739V21.1H18.909V8.966L9.70501 0L0.505005 8.966V21.1H6.67Z"
        fill={color}
      />
    </Svg>
  );
};

export default SvgComponent;
