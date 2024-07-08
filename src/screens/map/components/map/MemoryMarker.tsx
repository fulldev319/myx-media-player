import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Video from 'react-native-video';

import {hp, wp} from '../../global';
import {Colors, Fonts} from '../../res';
import {getDefaultAvatar} from 'helper/userHelpers';

const MemoryMarker = (props: any) => {
  const {data, onPress} = props;
  const videoRef = useRef(null);
  const [isStopVideo, setIsStopVideo] = useState(false);

  const renderImageContent = () => {
    return (
      <Image
        source={{
          uri: data.media.media,
        }}
        style={Style.mediaView}
      />
    );
  };

  const renderTextContent = () => {
    return (
      <View style={[Style.mediaView, {backgroundColor: '#9747FF', padding: 5}]}>
        <Text numberOfLines={4} ellipsizeMode="tail" style={Style.txtMedia}>
          {data.media.media}
        </Text>
      </View>
    );
  };

  const renderVideoContent = () => {
    return (
      <View style={[Style.mediaView]}>
        <Video
          ref={videoRef}
          source={{uri: data.media.media}}
          resizeMode={'cover'}
          paused={isStopVideo}
          onReadyForDisplay={() => {
            if (videoRef) {
              setTimeout(() => {
                setIsStopVideo(true);
              }, 1000);
            }
          }}
          style={[StyleSheet.absoluteFill, {borderRadius: 8}]}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity style={Style.mainContainer} onPress={onPress}>
      <View style={Style.container}>
        <View style={Style.contentCon}>
          {data.media.type === 'image' && renderImageContent()}
          {data.media.type === 'text' && renderTextContent()}
          {data.media.type === 'video' && renderVideoContent()}
        </View>
        <Image
          source={
            data.creator.image === ''
              ? getDefaultAvatar()
              : {uri: data.creator.image}
          }
          style={Style.userImage}
        />
      </View>
      <View style={[Style.triangle, Style.arrowDown]} />
    </TouchableOpacity>
  );
};

export default MemoryMarker;

const {width} = Dimensions.get('window');
const Style = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0,
    borderColor: 'red',
    borderRadius: 30,
  },
  container: {
    width: 92,
    height: 118,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.color2,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    top: -10,
    left: -10,
    borderWidth: 3,
    borderColor: 'black',
  },
  contentCon: {
    flex: 1,
  },
  listeningTo: {
    color: Colors.whiteRGBA60,
    fontFamily: Fonts.APPFONT_R,
    fontSize: wp(3),
  },
  mediaView: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songName: {
    color: Colors.white,
    fontFamily: Fonts.APPFONT_R,
    fontSize: wp(2.7),
    width: wp(35),
    marginTop: Platform.OS === 'android' ? wp(-1) : 0,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  arrowDown: {
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderLeftWidth: 8,
    borderTopColor: Colors.color2,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  txtMedia: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});
