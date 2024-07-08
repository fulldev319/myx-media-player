import React, {useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Video from 'react-native-video';

export const TrackMemoryCard = ({data, onClick}) => {
  const videoRef = useRef(null);
  const [isStopVideo, setIsTopVideo] = useState(false);

  if (data.mediaType === 'video') {
    return (
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={() => onClick(data)}>
        <Video
          ref={videoRef}
          source={{uri: data.mediaUrl}}
          resizeMode={'cover'}
          paused={isStopVideo}
          onReadyForDisplay={() => {
            if (videoRef) {
              setIsTopVideo(true);
            }
          }}
          style={[StyleSheet.absoluteFill, {borderRadius: 32}]}
        />
      </TouchableOpacity>
    );
  } else if (data.mediaType === 'image') {
    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => onClick(data)}>
        <Image
          source={{uri: data.mediaUrl}}
          style={[StyleSheet.absoluteFill, {borderRadius: 32}]}
        />
      </TouchableOpacity>
    );
  } else {
    // text
    return (
      <TouchableOpacity
        style={styles.textPublicContainer}
        onPress={() => onClick(data)}></TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 32,
    marginVertical: 10,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 32,
    marginVertical: 10,
  },
  textPublicContainer: {
    width: '100%',
    height: 300,
    borderRadius: 32,
    backgroundColor: '#9747FF',
    marginVertical: 10,
  },
  textFollowingContainer: {
    width: '100%',
    height: 300,
    borderRadius: 32,
    backgroundColor: '#FF67B2',
    marginVertical: 10,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    top: 0,
  },
  userInfo: {flexDirection: 'row', alignItems: 'center'},
  userIcon: {width: 24, height: 24, borderRadius: 12},
  userName: {
    fontSize: 12,
    fontWeight: '700',
    marginStart: 10,
    maxWidth: 200,
    color: 'white',
  },
  agoText: {
    fontSize: 10,
    fontWeight: '400',
    color: 'white',
  },
  detail: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    bottom: 0,
  },
  caption: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  textCaption: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    padding: 20,
    marginBottom: 50,
  },
  infoView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'grey',
    marginHorizontal: 10,
  },
  commentTxt: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    marginStart: 10,
  },
  action: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(1, 1, 1, 0.79)',
    alignItems: 'center',
    marginTop: 10,
  },
  interactive: {
    width: '100%',
    justifyContent: 'space-evenly',
  },
  topAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreDetailIcon: {
    padding: 10,
  },
});

export const FollowIcon = props => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <Path
      fill="#FF3F3F"
      d="M6.667 1.875c-3.115 0-5.625 2.558-5.625 5.694 0 2.979 1.57 7.425 7.378 10.149l.025.012c.316.148.54.252.875.327.386.086.974.086 1.36 0 .336-.075.559-.18.875-.327l.025-.012c5.809-2.724 7.378-7.17 7.378-10.149 0-3.136-2.51-5.694-5.625-5.694A5.557 5.557 0 0010 2.982a5.557 5.557 0 00-3.333-1.107z"></Path>
  </Svg>
);

export const ShareIcon = props => (
  <Svg width="21" height="20" fill="none" viewBox="0 0 21 20">
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M18.031 3.407a1.458 1.458 0 00-1.046-1.046c-.252-.065-.5-.032-.709.01-.208.043-.462.115-.755.2L3.934 5.88c-.37.105-.682.195-.92.282-.228.084-.5.204-.693.429a1.458 1.458 0 00-.205 1.59c.13.267.363.452.563.59.208.145.487.31.819.506l4.095 2.42c.288.17.386.23.472.296.125.097.236.209.333.333.067.087.126.184.296.472l2.42 4.096c.196.331.361.61.506.819.139.199.323.432.59.562.523.256 1.149.176 1.59-.204.225-.193.345-.465.43-.694.087-.237.176-.55.282-.92l3.31-11.586c.084-.294.157-.548.2-.756.042-.208.075-.457.01-.709zm-1.504.189a.86.86 0 01.155-.022c.065.02.116.072.136.137a.872.872 0 01-.021.155c-.032.155-.091.362-.183.685l-3.297 11.54c-.115.4-.191.667-.26.855a1.122 1.122 0 01-.084.188.208.208 0 01-.2.026 1.121 1.121 0 01-.127-.161 13.779 13.779 0 01-.468-.762L9.75 12.132c-.088-.15-.16-.27-.229-.378l2.86-2.86a.625.625 0 10-.884-.884l-2.86 2.86c-.107-.07-.228-.141-.377-.229L4.155 8.215a13.746 13.746 0 01-.762-.468 1.13 1.13 0 01-.16-.128.208.208 0 01.026-.2 1.13 1.13 0 01.187-.083c.189-.07.455-.146.855-.26l11.54-3.297c.323-.093.53-.151.686-.183z"
      clipRule="evenodd"></Path>
  </Svg>
);

const dummyMemberList = [
  {
    image: 'https://i.pravatar.cc/150?img=53',
  },
  {
    image: 'https://i.pravatar.cc/150?img=8',
  },
  {
    image: 'https://i.pravatar.cc/150?img=37',
  },
  {
    image: 'https://i.pravatar.cc/150?img=21',
  },
  {
    image: 'https://i.pravatar.cc/150?img=53',
  },
  {
    image: 'https://i.pravatar.cc/150?img=53',
  },
];
