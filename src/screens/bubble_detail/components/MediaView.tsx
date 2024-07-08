import React, {useRef, useState} from 'react';
import {View, Image} from 'react-native';
import Video from 'react-native-video';

export const MediaView = ({data}) => {
  const videoRef = useRef(null);
  const [isStopVideo, setIsTopVideo] = useState(false);

  return data.mediaType === 'video' ? (
    <Video
      ref={videoRef}
      source={{uri: data.mediaUrl}}
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
  ) : data.mediaType === 'image' ? (
    <Image
      source={{uri: data.mediaUrl}}
      resizeMode="contain"
      style={{width: '100%', height: '100%', borderRadius: 15}}
    />
  ) : (
    <View
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 15,
        backgroundColor: '#9747FF',
      }}
    />
  );
};
