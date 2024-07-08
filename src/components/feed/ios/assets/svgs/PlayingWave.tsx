import * as React from 'react';
import Svg, {G, Rect} from 'react-native-svg';

function PlayingWave(props) {
  return (
    <Svg
      width={11}
      height={10}
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G fill="#fff">
        <Rect y={2.48047} width={1.5} height={5} rx={0.75} />
        <Rect x={3} y={0.480469} width={1.5} height={9} rx={0.75} />
        <Rect x={6} y={3.48047} width={1.5} height={3} rx={0.75} />
        <Rect x={9} y={2.48047} width={1.5} height={5} rx={0.75} />
      </G>
    </Svg>
  );
}

export default PlayingWave;
