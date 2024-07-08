import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M7.29289 15.2929C6.90237 15.6834 6.90237 16.3166 7.29289 16.7071L13.6569 23.0711C14.0474 23.4616 14.6805 23.4616 15.0711 23.0711C15.4616 22.6805 15.4616 22.0474 15.0711 21.6569L9.41421 16L15.0711 10.3431C15.4616 9.95262 15.4616 9.31946 15.0711 8.92893C14.6805 8.53841 14.0474 8.53841 13.6569 8.92893L7.29289 15.2929ZM24 15H8V17H24V15Z"
      fill={props.color || 'white'}
    />
    <Rect x={0.5} y={0.5} width={31} height={31} rx={15.5} stroke="#0E0E0E" />
  </Svg>
);
export default SvgComponent;
