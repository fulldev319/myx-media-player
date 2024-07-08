import * as React from 'react';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import Feather from 'react-native-vector-icons/Feather';
import RNBackgroundDownloader from 'react-native-background-downloader';
const dayjs = require('dayjs');
import {useNavigation} from '@react-navigation/native';
import ChatAudioPlayer from './ChatAudioPlayer';
import {
  MiniPauseIcon,
  MiniPlayIcon,
  PlayIcon,
} from 'screens/MusicPlayer/components/musicPlayerIcons';
import {convertTimeFormat} from 'helper/utils';
import {PlayingStatus, useTracks} from 'contexts/TrackContext';

const OtherChatItem = ({item, otherUser, onPlayTrack, key}) => {
  const {navigate} = useNavigation();
  const {curTrack, playingStatus} = useTracks();
  // const downloadFile = async () => {
  //   RNBackgroundDownloader.download({
  //     id: item.id,
  //     url: encodeURI(item.mediaUrl),
  //     destination: `${RNBackgroundDownloader.directories.documents}/${item.message.originalname}`,
  //   })
  //     .begin(expectedBytes => {
  //       console.log(`Going to download ${expectedBytes} bytes!`);
  //     })
  //     .done(() => {
  //       Alert.alert('File Download', 'Download is done!');
  //       console.log('Download is done!');
  //     })
  //     .error(error => {
  //       Alert.alert('File Download', 'Download failed!');
  //       console.log('Download canceled due to error: ', error);
  //     });
  // };

  return (
    <View>
      {item?.newDate && (
        <Text style={styles.newDate}>
          {dayjs(item.created).format('dddd, MMM D, YYYY')}
        </Text>
      )}
      <View style={styles.container}>
        <View style={styles.msgContainer}>
          <View>
            <Text style={styles.account}>{otherUser?.name}</Text>
          </View>
          <View>
            {item.type === 'photo' ? (
              <TouchableOpacity
                onPress={() =>
                  navigate('ImageViewItem', {
                    url: item.mediaUrl,
                    type: 'photo',
                  })
                }>
                <Image
                  style={styles.photo}
                  source={{
                    uri: item.mediaUrl,
                  }}
                />
              </TouchableOpacity>
            ) : item.type === 'audio' ? (
              <View style={styles.audioWrapper}>
                <View style={styles.audioMsg}>
                  <ChatAudioPlayer
                    video={{
                      uri: item.mediaUrl,
                    }}
                  />
                </View>
              </View>
            ) : item.type === 'video' ? (
              <TouchableOpacity
                onPress={() =>
                  Platform.OS === 'android' &&
                  navigate('ImageViewItem', {
                    url: item.mediaUrl,
                    type: 'video',
                  })
                }
                style={{zIndex: 9999}}>
                <View style={styles.videoWrapper}>
                  <VideoPlayer
                    video={{
                      uri: item.mediaUrl,
                    }}
                    videoWidth={180}
                    videoHeight={180}
                    style={styles.video}
                    onPlayPress={() => {
                      Platform.OS === 'android' &&
                        navigate('ImageViewItem', {
                          url: item.mediaUrl,
                          type: 'video',
                        });
                    }}
                  />
                </View>
              </TouchableOpacity>
            ) : item.type === 'track' ? (
              <View style={[styles.trackContainer]}>
                <TouchableOpacity
                  onPress={() => {
                    onPlayTrack(item.track, 'normal');
                  }}>
                  <Image
                    source={{
                      uri: item.track.image,
                    }}
                    style={styles.image}
                  />
                  <View style={{position: 'absolute', top: 20, left: 20}}>
                    {curTrack?.id === `${item.track.id}-${item.id}` ? (
                      playingStatus === PlayingStatus.Loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : playingStatus === PlayingStatus.Playing ? (
                        <MiniPauseIcon />
                      ) : (
                        <MiniPlayIcon />
                      )
                    ) : (
                      <MiniPlayIcon />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.songInfoContainer}
                  onPress={() => {
                    onPlayTrack(item.track, 'full');
                  }}>
                  <Text style={styles.txtDuration}>
                    {convertTimeFormat(item.track.duration)}
                  </Text>
                  <Text
                    style={styles.txtName}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {item.track.title}
                  </Text>
                  <Text
                    style={styles.txtDesc}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {item.track.artists[0]}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // ) : item.type === 'file' ? (
              //   <View style={styles.content}>
              //     <Text style={styles.content}>{item.message.originalname}</Text>
              //     <TouchableOpacity
              //       onPress={downloadFile}
              //       style={styles.download}>
              //       <Feather name="download" color="#434343" size={16} />
              //     </TouchableOpacity>
              //   </View>
              <View style={styles.textContainer}>
                <Text style={styles.textContent}>{item.message}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 43,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  container: {
    marginHorizontal: 26,
    marginVertical: 8,
  },
  msgContainer: {
    marginRight: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#FF6651',
    padding: 16,
  },
  account: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 15,
    display: 'flex',
    alignItems: 'center',
    color: '#FF6651',
    marginBottom: 8,
  },
  textContainer: {
    minWidth: 50,
  },
  textContent: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  photoContainer: {},
  photo: {
    width: 180,
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    maxWidth: 263,
    minWidth: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#EBEBEB',
    borderRadius: 24,
    padding: 16,
    color: '#1A1B1C',
    fontSize: 14,
    lineHeight: 21,
    marginLeft: 8,
  },
  audioWrapper: {
    backgroundColor: '#060606',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 45,
    borderBottomRightRadius: 45,
  },
  audioMsg: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioPlay: {
    marginRight: 12,
  },
  duration: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  videoWrapper: {
    width: 180,
    height: 180,
    marginLeft: 8,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FF6651',
  },
  video: {
    width: 180,
    height: 180,
  },
  created: {
    fontSize: 10,
    paddingBottom: 4,
    marginLeft: 16,
  },
  download: {
    marginTop: 4,
    marginLeft: 'auto',
  },
  newDate: {
    fontSize: 12,
    color: '#A4A4A4',
    lineHeight: 18,
    textAlign: 'center',
    paddingVertical: 16,
  },
  trackContainer: {
    width: 250,
    height: 70,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -15,
  },
  numberText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.3)',
    width: 50,
    textAlign: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  txtDuration: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  txtName: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default React.memo(OtherChatItem);
