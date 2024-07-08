import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

export const SendIcon = ({disabled = false, ...props}) => (
  <Svg width={35} height={35} viewBox="0 0 49 49" fill="none" {...props}>
    <Rect
      width={49}
      height={49}
      rx={24.5}
      fill={disabled ? 'rgba(255, 255, 255, 0.1)' : '#9214F5'}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M31.7778 19.0664C31.6582 18.605 31.2979 18.2446 30.8365 18.1251C30.6097 18.0663 30.3859 18.0957 30.1983 18.134C30.0113 18.1723 29.7824 18.2377 29.5182 18.3132L19.0902 21.2926C18.7569 21.3878 18.4764 21.468 18.2623 21.5469C18.057 21.6225 17.8121 21.7303 17.6383 21.9325C17.2964 22.3302 17.2241 22.8933 17.4544 23.3645C17.5715 23.6041 17.7812 23.7702 17.9607 23.8953C18.1479 24.0257 18.3992 24.1741 18.6975 24.3504L22.3837 26.5286C22.6428 26.6817 22.7307 26.7348 22.8083 26.795C22.9203 26.8819 23.021 26.9825 23.1078 27.0945C23.168 27.1722 23.2211 27.26 23.3743 27.5192L25.5524 31.2053C25.7287 31.5037 25.8772 31.7549 26.0076 31.9421C26.1326 32.1216 26.2988 32.3313 26.5383 32.4484C27.0095 32.6788 27.5727 32.6065 27.9704 32.2646C28.1726 32.0907 28.2803 31.8459 28.356 31.6406C28.4349 31.4265 28.515 31.1459 28.6102 30.8127L31.5897 20.3847C31.6652 20.1204 31.7306 19.8915 31.7688 19.7045C31.8072 19.5169 31.8365 19.2931 31.7778 19.0664ZM30.4236 19.2363C30.5126 19.2181 30.5526 19.2168 30.5633 19.2167C30.6219 19.235 30.6678 19.281 30.6862 19.3396C30.6861 19.3503 30.6848 19.3903 30.6666 19.4792C30.6381 19.6187 30.5851 19.8055 30.5021 20.0962L27.5347 30.482C27.4317 30.8426 27.3629 31.082 27.3004 31.2516C27.2591 31.3636 27.2327 31.4086 27.2257 31.4204C27.1737 31.4586 27.1056 31.4674 27.0456 31.4436C27.0358 31.4339 26.9989 31.397 26.9307 31.299C26.8274 31.1507 26.7003 30.9365 26.5096 30.6137L24.326 26.9184C24.2468 26.7843 24.1824 26.6753 24.1195 26.5788L26.6937 24.0046C26.9134 23.785 26.9134 23.4288 26.6937 23.2091C26.474 22.9895 26.1179 22.9895 25.8982 23.2091L23.324 25.7833C23.2276 25.7205 23.1186 25.6561 22.9845 25.5769L19.2892 23.3933C18.9664 23.2025 18.7521 23.0755 18.6038 22.9722C18.5058 22.9039 18.4689 22.867 18.4593 22.8573C18.4355 22.7973 18.4442 22.7291 18.4824 22.6771C18.4942 22.6701 18.5392 22.6438 18.6513 22.6025C18.8209 22.54 19.0603 22.4712 19.4208 22.3682L29.8067 19.4008C30.0974 19.3177 30.2842 19.2648 30.4236 19.2363Z"
      fill="white"
      fillOpacity={disabled ? 0.3 : 1}
    />
  </Svg>
);
