import * as React from 'react';
import Svg, {Defs, G, LinearGradient, Path, Rect, Stop} from 'react-native-svg';

export const V2FeedTabIcon = ({isActive = false}) => {
  return (
    <Svg width="25" height="24" fill="none" viewBox="0 0 25 24">
      <Path
        fill={isActive ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
        d="M21.5 2h-18a1 1 0 00-1 1v18a1 1 0 001 1h18a1 1 0 001-1V3a1 1 0 00-1-1zm-7 18h-10v-7h10v7zm0-9h-10V4h10v7zm6 9h-4V4h4v16z"></Path>
    </Svg>
  );
};

export const V2ForYouTabIcon = ({isActive = false}) => {
  return (
    <Svg width="25" height="24" fill="none" viewBox="0 0 25 24">
      <Path
        fill={isActive ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
        d="M20.5 8l-6-5.26a3 3 0 00-4 0L4.5 8a3 3 0 00-1 2.26V19a3 3 0 003 3h12a3 3 0 003-3v-8.75a3 3 0 00-1-2.25zm-6 12h-4v-5a1 1 0 011-1h2a1 1 0 011 1v5zm5-1a1 1 0 01-1 1h-2v-5a3 3 0 00-3-3h-2a3 3 0 00-3 3v5h-2a1 1 0 01-1-1v-8.75a1 1 0 01.34-.75l6-5.25a1 1 0 011.32 0l6 5.25a1 1 0 01.34.75V19z"></Path>
    </Svg>
  );
};

export const V2BubbleTabIcon = ({isActive = false}) => {
  return (
    <Svg width="25" height="24" fill="none" viewBox="0 0 25 24">
      <Path
        fill={isActive ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
        d="M21.11 19.188a7 7 0 00-2.74-10.57 8 8 0 10-14.19 6.29l-1.39 1.38a1 1 0 00-.21 1.09 1 1 0 00.92.62h5.69a7 7 0 006.31 4h6a.999.999 0 00.92-.62 1 1 0 00-.21-1.09l-1.1-1.1zM8.5 14.998c.001.335.028.67.08 1H5.91l.35-.34a.999.999 0 000-1.42 5.929 5.929 0 01-1.76-4.24 6 6 0 016-6 5.94 5.94 0 015.65 4h-.65a7 7 0 00-7 7zm10.54 5l.05.05H15.5a5 5 0 113.54-1.46 1 1 0 00-.3.7 1 1 0 00.3.71z"></Path>
    </Svg>
  );
};
