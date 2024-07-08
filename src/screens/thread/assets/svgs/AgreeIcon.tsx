import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function AgreeIcon(props) {
  return (
    <Svg
      width={31}
      height={31}
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={15.25} cy={15.4805} r={15} fill="#08B883" fillOpacity={0.1} />
      <Path
        d="M20.25 16.98a.75.75 0 00-.915.54 5.25 5.25 0 01-5.085 3.96h-4.193l.48-.472a.75.75 0 000-1.057 5.25 5.25 0 013.713-8.97.75.75 0 100-1.5A6.75 6.75 0 009 20.446l-1.282 1.252a.75.75 0 00-.158.818.75.75 0 00.69.465h6a6.75 6.75 0 006.54-5.063.75.75 0 00-.54-.937zm2.032-6.554l-2.25-2.25a.75.75 0 00-.247-.158.75.75 0 00-.57 0 .75.75 0 00-.247.158l-2.25 2.25a.753.753 0 101.064 1.065l.968-.953v4.193a.75.75 0 101.5 0v-4.193l.968.975a.748.748 0 001.064 0 .75.75 0 000-1.065v-.022z"
        fill={props.isSelected ? "#08B883" : "#fff"}
        fillOpacity={props.isSelected ? 1 : 0.3}
      />
    </Svg>
  );
}

export default AgreeIcon;
