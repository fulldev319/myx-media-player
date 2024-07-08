import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import Video from 'react-native-video';

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const {url} = props;
  const videoRef = useRef(null);
  const [isStopVideo, setIsTopVideo] = useState(false);
  return (
    <Video
      ref={videoRef}
      source={{uri: url}}
      resizeMode={'cover'}
      paused={isStopVideo}
      onReadyForDisplay={() => {
        if (videoRef) {
          setTimeout(() => {
            setIsTopVideo(true);
          }, 1000);
        }
      }}
      style={[{width: '100%', height: '100%', borderRadius: 15}]}
    />
  );
};
