import * as React from 'react';
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
import Feather from 'react-native-vector-icons/Feather';
import RNBackgroundDownloader from 'react-native-background-downloader';
const dayjs = require('dayjs');
import {useNavigation} from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';
import ChatAudioPlayer from './ChatAudioPlayer';
import {PlayingStatus, useTracks} from 'contexts/TrackContext';
import {
  MiniPauseIcon,
  MiniPlayIcon,
} from 'screens/MusicPlayer/components/musicPlayerIcons';
import {convertTimeFormat} from 'helper/utils';

const MyChatItem = ({item, onPlayTrack}) => {
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
            <Text style={styles.account}>Me</Text>
          </View>
          {item.type === 'photo' ? (
            <View style={styles.photoContainer}>
              <TouchableOpacity
                onPress={() => navigate('ImageViewItem', {url: item.mediaUrl})}>
                <Image
                  style={styles.photo}
                  source={{
                    uri: item.mediaUrl,
                  }}
                />
              </TouchableOpacity>
            </View>
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
          ) : item.type === 'track' && item.track ? (
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
                <View style={{position: 'absolute', top: 40, left: 20}}>
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
            // <View style={styles.fileContainer}>
            //   {/* <Text style={styles.content}>{item.message.originalname}</Text> */}
            //   <TouchableOpacity onPress={downloadFile} style={styles.download}>
            //     <Feather name="download" color="#434343" size={16} />
            //   </TouchableOpacity>
            // </View>
            <View style={styles.textContainer}>
              <Text style={styles.textContent}>{item.message}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderLeftColor: '#08B883',
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
    color: '#08B883',
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  fileContainer: {
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: '#EBEBEB',
    maxWidth: 263,
    marginLeft: 'auto',
    marginRight: 16,
    padding: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  created: {
    fontSize: 10,
    marginLeft: 'auto',
    marginRight: 24,
    paddingTop: 4,
  },
  download: {
    marginTop: 4,
    marginLeft: 'auto',
  },
  audioWrapper: {
    width: 280,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  audioMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginLeft: 'auto',
    marginRight: 16,
    marginTop: 24,
    borderRadius: 24,
    overflow: 'hidden',
    flexGrow: 1,
    backgroundColor: '#FF6651',
  },
  video: {
    width: 180,
    height: 180,
  },
  newDate: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
    marginVertical: 18,
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
    marginTop: 20,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
    marginTop: 20,
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

export default React.memo(MyChatItem);
