import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function DisagreeIcon(props) {
  return (
    <Svg
      width={19}
      height={19}
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M14.75 10.98a.75.75 0 00-.915.54 5.25 5.25 0 01-5.085 3.96H4.558l.48-.472a.75.75 0 000-1.057A5.25 5.25 0 018.75 4.98c.22-.012.44-.012.66 0a.755.755 0 00.18-1.5 6.24 6.24 0 00-.84 0A6.75 6.75 0 003.5 14.444l-1.282 1.253a.75.75 0 00-.158.817.75.75 0 00.69.465h6a6.75 6.75 0 006.54-5.062.75.75 0 00-.54-.938zm2.032-5.055a.75.75 0 00-1.065 0l-.967.998V2.73a.75.75 0 10-1.5 0v4.193l-.967-.975a.752.752 0 10-1.066 1.065l2.25 2.25a.75.75 0 00.248.157.705.705 0 00.57 0 .75.75 0 00.248-.157l2.25-2.25a.75.75 0 000-1.065v-.023z"
        fill={!props.isSelected ? '#FC82DA' : '#fff'}
        fillOpacity={!props.isSelected ? 1 : 0.3}
      />
    </Svg>
  );
}

export default DisagreeIcon;
