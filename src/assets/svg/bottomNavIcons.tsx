import * as React from 'react';
import Svg, {Defs, G, LinearGradient, Path, Rect, Stop} from 'react-native-svg';

export const HomeIcon = ({isActive = false}) =>
  !isActive ? (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M7.13478 18.7733V15.7156C7.13478 14.9351 7.77217 14.3023 8.55844 14.3023H11.4326C11.8102 14.3023 12.1723 14.4512 12.4393 14.7163C12.7063 14.9813 12.8563 15.3408 12.8563 15.7156V18.7733C12.8539 19.0978 12.9821 19.4099 13.2124 19.6402C13.4427 19.8705 13.7561 20 14.0829 20H16.0438C16.9596 20.0023 17.8388 19.6428 18.4872 19.0008C19.1356 18.3588 19.5 17.487 19.5 16.5778V7.86686C19.5 7.13246 19.1721 6.43584 18.6046 5.96467L11.934 0.675869C10.7737 -0.251438 9.11111 -0.221498 7.98539 0.746979L1.46701 5.96467C0.872741 6.42195 0.517552 7.12064 0.5 7.86686V16.5689C0.5 18.4639 2.04738 20 3.95617 20H5.87229C6.55123 20 7.103 19.4562 7.10792 18.7822L7.13478 18.7733Z"
        fill={'#686868'}
      />
    </Svg>
  ) : (
    <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <Path
        fill="url(#paint0_linear_14432_18889)"
        d="M7.51 18.773v-3.057c0-.78.637-1.414 1.423-1.414h2.875c.377 0 .74.15 1.006.414.267.265.417.625.417 1v3.057c-.002.325.126.637.356.867.23.23.544.36.87.36h1.962a3.46 3.46 0 002.443-1 3.41 3.41 0 001.013-2.422V7.867c0-.735-.328-1.431-.895-1.902L12.309.675A3.097 3.097 0 008.36.748L1.842 5.965a2.474 2.474 0 00-.967 1.902v8.702C.875 18.464 2.422 20 4.331 20h1.916c.68 0 1.231-.544 1.236-1.218l.027-.009z"></Path>
      <Defs>
        <LinearGradient
          id="paint0_linear_14432_18889"
          x1="4.675"
          x2="17.853"
          y1="3.125"
          y2="7.299"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF3F3F"></Stop>
          <Stop offset="1" stopColor="#FF701F"></Stop>
        </LinearGradient>
      </Defs>
    </Svg>
  );

export const FeedIcon = ({isActive = false}) => (
  <Svg width="25" height="24" fill="none" viewBox="0 0 25 24">
    <Path
      fill={isActive ? '#FFFFFF' : '#686868'}
      d="M15.95 3.78c-.04.25-.06.5-.06.75 0 2.25 1.82 4.07 4.06 4.07.25 0 .49-.03.74-.07v8.07c0 3.39-2 5.4-5.4 5.4H7.901C4.5 22 2.5 19.99 2.5 16.6V9.2c0-3.4 2-5.42 5.401-5.42h8.049zm.201 6.08a.768.768 0 00-.701.31l-2.419 3.13-2.771-2.18a.79.79 0 00-.57-.16.775.775 0 00-.5.3l-2.959 3.85-.061.09a.747.747 0 00.21.95c.14.09.29.15.46.15.231.01.45-.11.59-.3l2.51-3.23 2.85 2.14.09.06c.32.17.72.09.95-.21l2.89-3.73-.04.02c.16-.22.19-.5.08-.75a.737.737 0 00-.609-.44zM20.091 2c1.33 0 2.41 1.08 2.41 2.41s-1.08 2.41-2.41 2.41-2.41-1.08-2.41-2.41S18.76 2 20.09 2z"></Path>
  </Svg>
);

export const ProfileIcon = ({isActive = false}) => (
  <Svg width="25" height="24" fill="none" viewBox="0 0 25 24">
    <Path
      fill={isActive ? '#FFFFFF' : '#686868'}
      d="M12.5 15.174c4.339 0 8 .705 8 3.425 0 2.721-3.685 3.401-8 3.401-4.338 0-8-.705-8-3.425 0-2.721 3.685-3.401 8-3.401zM12.5 2a5.273 5.273 0 015.294 5.291 5.274 5.274 0 01-5.294 5.292 5.275 5.275 0 01-5.294-5.292A5.274 5.274 0 0112.5 2z"></Path>
  </Svg>
);

export const ChatIcon = ({isActive = false, isWhite = false}) =>
  !isActive || isWhite ? (
    <Svg width={21} height={20} viewBox="0 0 21 20" fill="none">
      <Path
        d="M10.3533 0C16.0333 0 20.3333 4.65699 20.3333 9.98498C20.3333 16.1642 15.2933 20 10.3333 20C8.69333 20 6.87333 19.5593 5.41333 18.698C4.90333 18.3876 4.47333 18.1572 3.92333 18.3375L1.90333 18.9384C1.39333 19.0986 0.933328 18.698 1.08333 18.1572L1.75333 15.9139C1.86333 15.6034 1.84333 15.2729 1.68333 15.0125C0.823328 13.4301 0.333328 11.6975 0.333328 10.015C0.333328 4.74712 4.54333 0 10.3533 0ZM14.9233 8.74311C14.2133 8.74311 13.6433 9.31397 13.6433 10.025C13.6433 10.7261 14.2133 11.307 14.9233 11.307C15.6333 11.307 16.2033 10.7261 16.2033 10.025C16.2033 9.31397 15.6333 8.74311 14.9233 8.74311ZM10.3133 8.74311C9.61333 8.7331 9.03333 9.31397 9.03333 10.015C9.03333 10.7261 9.60333 11.2969 10.3133 11.307C11.0233 11.307 11.5933 10.7261 11.5933 10.025C11.5933 9.31397 11.0233 8.74311 10.3133 8.74311ZM5.70333 8.74311C4.99333 8.74311 4.42333 9.31397 4.42333 10.025C4.42333 10.7261 5.00333 11.307 5.70333 11.307C6.41333 11.2969 6.98333 10.7261 6.98333 10.025C6.98333 9.31397 6.41333 8.74311 5.70333 8.74311Z"
        fill={isActive ? '#FFFFFF' : '#686868'}
      />
    </Svg>
  ) : (
    <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <Path
        fill="url(#paint0_linear_14455_9096)"
        d="M10.02 0C15.7 0 20 4.657 20 9.985 20 16.165 14.96 20 10 20c-1.64 0-3.46-.44-4.92-1.302-.51-.31-.94-.54-1.49-.36l-2.02.6c-.51.16-.97-.24-.82-.78l.67-2.244c.11-.31.09-.641-.07-.902C.49 13.43 0 11.697 0 10.015 0 4.747 4.21 0 10.02 0zm4.57 8.743c-.71 0-1.28.571-1.28 1.282 0 .701.57 1.282 1.28 1.282.71 0 1.28-.58 1.28-1.282 0-.711-.57-1.282-1.28-1.282zm-4.61 0c-.7-.01-1.28.571-1.28 1.272 0 .711.57 1.282 1.28 1.292.71 0 1.28-.58 1.28-1.282 0-.711-.57-1.282-1.28-1.282zm-4.61 0c-.71 0-1.28.571-1.28 1.282 0 .701.58 1.282 1.28 1.282a1.29 1.29 0 001.28-1.282c0-.711-.57-1.282-1.28-1.282z"></Path>
      <Defs>
        <LinearGradient
          id="paint0_linear_14455_9096"
          x1="4"
          x2="17.736"
          y1="3.125"
          y2="7.705"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF3F3F"></Stop>
          <Stop offset="1" stopColor="#FF701F"></Stop>
        </LinearGradient>
      </Defs>
    </Svg>
  );

export const SearchIcon = ({isActive = false}) => (
  <Svg width="21" height="20" fill="none" viewBox="0 0 21 20">
    <Path
      fill={isActive ? '#FFFFFF' : '#686868'}
      d="M15.87 15.654a.986.986 0 011.393 0l2.555 2.062h.044c.517.523.517 1.37 0 1.892a1.314 1.314 0 01-1.871 0l-2.12-2.43-.08-.09a1.083 1.083 0 01.08-1.434zM8.829 0c2.275 0 4.456.913 6.065 2.54a8.717 8.717 0 012.512 6.13c0 4.788-3.84 8.67-8.577 8.67C4.09 17.34.25 13.458.25 8.67S4.09 0 8.828 0z"></Path>
  </Svg>
);

export const SocialIcon = ({isActive = false}) => (
  <Svg width="25" height="24" fill="none" viewBox="0 0 25 24">
    <Path
      fill={isActive ? '#fff' : '#686868'}
      d="M12.375 0c6.624 0 12 5.376 12 12 0 6.636-5.376 12-12 12-6.636 0-12-5.364-12-12 0-6.624 5.364-12 12-12zm4.62 8.052a.539.539 0 00-.672-.684l-6.144 1.92a.801.801 0 00-.528.528l-1.92 6.156a.537.537 0 00.672.672l6.12-1.92a.778.778 0 00.528-.528l1.944-6.144z"></Path>
  </Svg>
);

export const CenterPlusIcon = () => (
  <Svg width="45" height="44" fill="none" viewBox="0 0 45 44">
    <Rect width="44" height="44" x="0.5" fill="#08B883" rx="22"></Rect>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M22.5 16.167v11.666M16.666 22h11.667"></Path>
  </Svg>
);

export const PlusIcon = props => (
  <Svg
    width={35}
    height={35}
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.03125 17.5C0.03125 7.85228 7.85228 0.03125 17.5 0.03125C27.1477 0.03125 34.9688 7.85228 34.9688 17.5C34.9688 27.1477 27.1477 34.9688 17.5 34.9688C7.85228 34.9688 0.03125 27.1477 0.03125 17.5ZM17.5 9.78125C18.1731 9.78125 18.7188 10.3269 18.7188 11V16.2812H24C24.6731 16.2812 25.2188 16.8269 25.2188 17.5C25.2188 18.1731 24.6731 18.7188 24 18.7188H18.7188V24C18.7188 24.6731 18.1731 25.2188 17.5 25.2188C16.8269 25.2188 16.2812 24.6731 16.2812 24V18.7188H11C10.3269 18.7188 9.78125 18.1731 9.78125 17.5C9.78125 16.8269 10.3269 16.2812 11 16.2812H16.2812V11C16.2812 10.3269 16.8269 9.78125 17.5 9.78125Z"
      fill="#010101"
    />
  </Svg>
);

export const WaveformIcon = props => (
  <Svg
    width={'100%'}
    height={31}
    viewBox="0 0 278 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={2} height={31} fill="white" />
    <Rect x={4} width={2} height={31} fill="white" />
    <Rect x={8} y={4} width={2} height={23} fill="white" />
    <Rect x={12} width={2} height={31} fill="white" />
    <Rect x={16} y={6} width={2} height={19} fill="white" />
    <Rect x={20} y={2} width={2} height={27} fill="white" />
    <Rect x={24} width={2} height={31} fill="white" />
    <Rect x={28} width={2} height={31} fill="white" />
    <Rect x={32} y={4} width={2} height={23} fill="white" />
    <Rect x={36} width={2} height={31} fill="white" />
    <Rect x={40} width={2} height={31} fill="white" />
    <Rect x={44} width={2} height={31} fill="white" />
    <Rect x={48} y={4} width={2} height={23} fill="white" />
    <Rect x={52} width={2} height={31} fill="white" />
    <Rect x={56} y={6} width={2} height={19} fill="white" />
    <Rect x={60} y={2} width={2} height={27} fill="white" />
    <Rect x={64} width={2} height={31} fill="white" />
    <Rect x={68} width={2} height={31} fill="white" />
    <Rect x={72} y={4} width={2} height={23} fill="white" />
    <Rect x={76} width={2} height={31} fill="white" />
    <Rect x={80} width={2} height={31} fill="white" />
    <Rect x={84} width={2} height={31} fill="white" />
    <Rect x={88} y={4} width={2} height={23} fill="white" />
    <Rect x={92} width={2} height={31} fill="white" />
    <Rect x={96} y={6} width={2} height={19} fill="white" />
    <Rect x={100} y={2} width={2} height={27} fill="white" />
    <Rect x={104} width={2} height={31} fill="white" />
    <Rect x={108} width={2} height={31} fill="white" />
    <Rect x={112} y={4} width={2} height={23} fill="white" />
    <Rect x={116} width={2} height={31} fill="white" />
    <Rect x={120} width={2} height={31} fill="white" />
    <Rect x={124} width={2} height={31} fill="white" />
    <Rect x={128} y={4} width={2} height={23} fill="white" />
    <Rect x={132} width={2} height={31} fill="white" />
    <Rect x={136} y={6} width={2} height={19} fill="white" />
    <Rect x={140} y={2} width={2} height={27} fill="white" />
    <Rect x={144} width={2} height={31} fill="white" />
    <Rect x={148} width={2} height={31} fill="white" />
    <Rect x={152} y={4} width={2} height={23} fill="white" />
    <Rect x={156} width={2} height={31} fill="white" />
    <Rect x={160} width={2} height={31} fill="white" />
    <Rect x={164} width={2} height={31} fill="white" />
    <Rect x={168} y={4} width={2} height={23} fill="white" />
    <Rect x={172} width={2} height={31} fill="white" />
    <Rect x={176} y={6} width={2} height={19} fill="white" />
    <Rect x={180} y={2} width={2} height={27} fill="white" />
    <Rect x={184} width={2} height={31} fill="white" />
    <Rect x={188} width={2} height={31} fill="white" />
    <Rect x={192} y={4} width={2} height={23} fill="white" />
    <Rect x={196} width={2} height={31} fill="white" />
    <Rect x={200} width={2} height={31} fill="white" />
    <Rect x={204} width={2} height={31} fill="white" />
    <Rect x={208} y={4} width={2} height={23} fill="white" fillOpacity={0.2} />
    <Rect x={212} width={2} height={31} fill="white" fillOpacity={0.2} />
    <Rect x={216} y={6} width={2} height={19} fill="white" fillOpacity={0.2} />
    <Rect x={220} y={2} width={2} height={27} fill="white" fillOpacity={0.2} />
    <Rect x={224} width={2} height={31} fill="white" fillOpacity={0.2} />
    <Rect x={228} width={2} height={31} fill="white" fillOpacity={0.2} />
    <Rect x={232} y={4} width={2} height={23} fill="white" fillOpacity={0.2} />
    <Rect x={236} width={2} height={31} fill="white" fillOpacity={0.2} />
    <Rect x={240} width={2} height={31} fill="white" fillOpacity={0.2} />
    <Rect x={244} width={2} height={31} fill="white" fillOpacity={0.2} />
    <Rect x={248} y={4} width={2} height={23} fill="white" fillOpacity={0.2} />
    <Rect x={252} width={2} height={31} fill="white" fillOpacity={0.2} />
    <Rect x={256} y={6} width={2} height={19} fill="white" fillOpacity={0.2} />
    <Rect x={260} y={2} width={2} height={27} fill="white" fillOpacity={0.2} />
    <Rect x={264} width={2} height={31} fill="white" fillOpacity={0.2} />
    <Rect x={268} width={2} height={31} fill="white" fillOpacity={0.2} />
    <Rect x={272} y={4} width={2} height={23} fill="white" fillOpacity={0.2} />
    <Rect x={276} width={2} height={31} fill="white" fillOpacity={0.2} />
  </Svg>
);
