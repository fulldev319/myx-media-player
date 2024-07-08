import {generateComponentKey, SCREEN_WIDTH} from 'helper/utils';
import React, {useMemo, useState} from 'react';
import Svg, {G, Circle, Defs, Path, Rect} from 'react-native-svg';

export const SnipWaveProgress = ({
  startPro = 20,
  endPro = 50,
  playingPro = 0,
  waveList = [],
  width = 0,
}) => {
  // point for start x
  const point1 = useMemo(() => {
    return (width * startPro) / 100;
  }, [startPro, width]);

  // point for end x
  const point2 = useMemo(() => {
    return (width * endPro) / 100;
  }, [endPro, width]);

  return (
    <Svg
      width={width}
      height={40}
      viewBox={`0 0 ${width} 31`}
      preserveAspectRatio="none"
      fill="none">
      <G>
        {waveList.map((item, index) => {
          const isSelected =
            index >= startPro && index <= playingPro && index <= endPro;
          return (
            <Rect
              width={2}
              x={item.x}
              y={item.y}
              rx={2}
              height={item.height}
              fill={isSelected ? '#FF3F3F' : '#D9D9D9'}
              key={`snip_audio_${generateComponentKey()}`}
            />
          );
        })}
      </G>
      <Path
        fill="#FF6651"
        fillOpacity="0.1"
        d={`M0 0H${point2 - 5}V40H${point1 - 5}V0z`}
      />
    </Svg>
  );
};
