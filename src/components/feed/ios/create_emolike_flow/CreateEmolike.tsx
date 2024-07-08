import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import {Slider} from '@miblanchard/react-native-slider';
import CameraRoll from '@react-native-community/cameraroll';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import FileManagerServices from 'service/FileManagerServices';

import {SearchBar} from 'components/common/SearchBar';
import {EmojiWaveProgress} from './WaveProgress';
import {compressMedia, convertTimeFormat, isCloseToBottom} from 'helper/utils';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {
  apiCreateEmoLikes,
  apiGetEmojies,
  apiSearchEmojies,
} from 'helper/emoLikesHelper';

const STICKER_DIR = `${RNFS.DocumentDirectoryPath}/SoundStickers`;
const dummyEmojiBgUrl =
  'https://ipfs.filebase.io/ipfs/QmSi7vwEZ5G5Eb43Z83sWaXj5kq86XjyKRsMYWkDfduQ5M/QmWdEghHkdjbRS7kYTB9N4AM3GoLduGv3BTutTwAntMvwa';

export const CreateEmolikeSheet = ({
  audioInfo,
  duration,
  show,
  onClose,
  onSuccess,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const videoRef = useRef(null);
  const snapPoints = useMemo(() => [650, 650], []);

  const [galleryImageList, setGalleryImageList] = useState([]);

  const [hasMoreEmoji, setHasMoreEmoji] = useState(true);
  const [lastIdEmoji, setLastIdEmoji] = useState(null);
  const [arrEmoji, setArrEmoji] = useState([]);
  const [loadingEmoji, setLoadingEmoji] = useState(false);

  const [hasSearchMoreEmoji, setHasMoreSearchEmoji] = useState(true);
  const [lastIdSearchEmoji, setLastIdSearchEmoji] = useState(null);
  const [arrSearchEmoji, setArrSearchEmoji] = useState([]);
  const [loadingSearchEmoji, setLoadingSearchEmoji] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioPaused, setAudioPaused] = useState(true);

  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [searchText, setSearchText] = useState('');

  const stickerPath = `${
    Platform.OS === 'android'
      ? RNFS.DownloadDirectoryPath
      : RNFS.DocumentDirectoryPath
  }/SoundStickers`;

  useEffect(() => {
    if (audioInfo) {
      if (audioInfo.url.includes('https:')) {
        setAudioUrl(audioInfo.url);
      } else {
        setAudioUrl(
          'https://ipfs.filebase.io/ipfs/QmU9rKYsZadZsAnceBc7pppbEDtFhsmWQJQjkkYg3QDxZ1',
        );
      }
    }
  }, [audioInfo]);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
      loadEmoji();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  useEffect(() => {
    hasAndroidPermission();
  }, []);

  useEffect(() => {
    if (searchText === '') {
      loadEmoji(true);
    } else {
      searchEmoji(searchText, true);
    }
  }, [searchText]);

  const hasAndroidPermission = async () => {
    if (Platform.OS !== 'android') {
      loadVideosFromLocal();
      return true;
    }

    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      loadVideosFromLocal();
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const loadEmoji = async (isRefresh = false) => {
    if (!loadingEmoji && hasMoreEmoji) {
      setLoadingEmoji(true);
      const res = await apiGetEmojies(30, isRefresh ? null : lastIdEmoji);

      if (res.success) {
        setLastIdEmoji(res.lastId);
        setHasMoreEmoji(res.hasMore);

        if (isRefresh) {
          setArrEmoji(res.data);
        } else {
          setArrEmoji(prev => [...prev, ...res.data]);
        }
      }
      setLoadingEmoji(false);
    }
  };

  const searchEmoji = async (searchText, isRefresh = false) => {
    if (isRefresh) {
      setLoadingSearchEmoji(true);
      const res = await apiSearchEmojies(searchText, 30, null);

      if (res.success) {
        setLastIdSearchEmoji(res.lastId);
        setHasMoreSearchEmoji(res.hasMore);
        setArrSearchEmoji(res.data);
      }
      setLoadingSearchEmoji(false);
    } else {
      if (!loadingSearchEmoji && hasSearchMoreEmoji) {
        setLoadingSearchEmoji(true);
        const res = await apiSearchEmojies(searchText, 30, lastIdSearchEmoji);

        if (res.success) {
          setLastIdSearchEmoji(res.lastId);
          setHasMoreSearchEmoji(res.hasMore);

          setArrSearchEmoji(prev => [...prev, ...res.data]);
        }
        setLoadingSearchEmoji(false);
      }
    }
  };

  const loadVideosFromLocal = async () => {
    const videos = await CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    });
    setGalleryImageList(videos.edges);
  };

  const onPlay = () => {
    setAudioPaused(false);
  };

  const onSaveEmolike = async () => {
    if (selectedPhoto === '' || selectedEmoji === null) {
      return;
    }
    setLoading(true);
    const encodedUri = encodeURI(selectedPhoto);
    const destPath1 = `${RNFS.DocumentDirectoryPath}/SoundStickers/temp1.png`;
    const destPath2 = `${RNFS.DocumentDirectoryPath}/SoundStickers/temp2.png`;
    const destPath3 = `${RNFS.DocumentDirectoryPath}/SoundStickers/temp3.png`;
    const bgImagePath = await RNFS.copyAssetsFileIOS(
      encodedUri,
      destPath1,
      0,
      0,
    );
    const stickerName = `sticker_final.mp4`;
    const stickerFinalPath = stickerPath + '/' + stickerName;

    // trim audio
    const trimFileUrl = `${RNFS.DocumentDirectoryPath}/clio_trimmed_tmp.wav`;

    FileManagerServices.makeDirectory(STICKER_DIR).then(() => {
      FFmpegKit.execute(
        `-ss ${audioInfo.start} -i ${audioUrl} -t ${
          audioInfo.end - audioInfo.start
        } -y ${trimFileUrl}`,
      ).then(async session => {
        const returnCode = await session.getReturnCode();

        // Merge image and emoji background image
        if (ReturnCode.isSuccess(returnCode)) {
          let base64String;
          base64String = await compressMedia('audio', trimFileUrl);
          base64String = await getBase64String(base64String);
          const processedAudioUrl = await uploadFileToIPFS(
            base64String,
            'audio/acc',
          );

          // Merge image and emoji
          FFmpegKit.execute(
            `-i ${bgImagePath} -i ${dummyEmojiBgUrl} -y -filter_complex "[1]scale=iw*2:-1[b];[0:v][b] overlay=W-w:0" ${destPath2}`,
          ).then(async session => {
            const returnCode = await session.getReturnCode();

            // Merge image and emoji background image
            if (ReturnCode.isSuccess(returnCode)) {
              FFmpegKit.execute(
                `-i ${destPath2} -i ${selectedEmoji.image} -y -filter_complex "[1]scale=iw/4:-1[b];[0:v][b] overlay=W-w-145:90" ${destPath3}`,
              ).then(async session => {
                const returnCode = await session.getReturnCode();

                if (ReturnCode.isSuccess(returnCode)) {
                  // Merge image and audio
                  FFmpegKit.execute(
                    `-i ${destPath3}  -i ${processedAudioUrl} -c:v libx264   -pix_fmt yuv420p   -y -vf scale=480:480 ${stickerFinalPath}`,
                  ).then(async session => {
                    const returnCode = await session.getReturnCode();
                    if (ReturnCode.isSuccess(returnCode)) {
                      CameraRoll.save(stickerFinalPath, {
                        type: 'video',
                        album: 'SoundSticker',
                      }).then(async () => {
                        await onCreateEmolike(stickerFinalPath);
                      });
                    } else {
                      setLoading(false);
                    }
                  });
                } else {
                  setLoading(false);
                }
              });
            } else {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      });
    });
  };

  const onCreateEmolike = async emoPath => {
    let base64String;
    base64String = await getBase64String(emoPath);
    const processedAudioUrl = await uploadFileToIPFS(base64String, 'video/mp4');

    const res = await apiCreateEmoLikes(
      selectedEmoji.id,
      processedAudioUrl,
      audioInfo.debate,
    );

    if (res.success) {
      sheetRef.current?.close();

      setTimeout(() => {
        onSuccess(processedAudioUrl, selectedEmoji.image);
      }, 400);
    }

    setLoading(false);
  };

  const onSeek = time => {};

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => {
            sheetRef.current.close();
            onClose();
          }}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.txtTitle}>Create Emolike</Text>
      </View>
    );
  };

  const renderPlayerView = () => {
    return (
      <View style={styles.playerView}>
        <View style={[StyleSheet.absoluteFill, {borderRadius: 16}]}>
          <Video
            source={{uri: audioUrl ? audioUrl : 'https://'}}
            ref={videoRef}
            paused={audioPaused}
            audioOnly={true}
            onLoadStart={() => setIsLoadingAudio(true)}
            onLoad={() => setIsLoadingAudio(false)}
            onError={() => setIsLoadingAudio(false)}
            onEnd={() => {
              videoRef.current?.seek(0);
              setAudioProgress(0);

              setTimeout(() => {
                setAudioPaused(true);
              }, 100);
            }}
            resizeMode={'cover'}
            onProgress={progress => {
              const currentPro =
                (progress.currentTime / progress.playableDuration) * 100;
              setAudioProgress(currentPro);
            }}
            style={[StyleSheet.absoluteFill]}
          />
          {selectedPhoto !== '' && selectedPhoto !== undefined && (
            <Image
              source={{uri: selectedPhoto}}
              style={[StyleSheet.absoluteFill, {borderRadius: 16}]}
            />
          )}
          <LinearGradient
            useAngle={true}
            angle={180}
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
            style={[
              StyleSheet.absoluteFill,
              {borderRadius: 16},
            ]}></LinearGradient>
        </View>
        <EmojiWaveProgress />
        {renderPlayControl()}
        {selectedEmoji !== null && (
          <View style={styles.emoView}>
            <Image
              source={{uri: selectedEmoji.image}}
              style={[{width: 35, height: 35}]}
            />
          </View>
        )}
      </View>
    );
  };

  const renderPlayControl = () => {
    return (
      <View style={styles.controlView}>
        <TouchableOpacity onPress={onPlay}>
          {audioPaused ? <PlayIcon /> : <PauseIcon />}
        </TouchableOpacity>
        <Slider
          containerStyle={styles.slider}
          minimumValue={0}
          maximumValue={100}
          onSlidingComplete={onSeek}
          value={audioProgress}
          minimumTrackTintColor={'#D9D9D9'}
          maximumTrackTintColor={'#D9D9D9'}
          thumbStyle={{
            width: 6,
            height: 6,
            borderRadius: 6,
            backgroundColor: '#D9D9D9',
          }}
          trackStyle={{
            backgroundColor: '#D9D9D9',
            height: 2,
          }}
        />
        <Text style={styles.txtSliderTime}>
          {/* {duration && convertTimeFormat(duration)} */}
        </Text>
      </View>
    );
  };

  const renderBgList = () => {
    return (
      <View style={{width: '100%', height: 50, marginTop: 24}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{height: 50}}
          contentContainerStyle={{height: 48}}>
          <TouchableOpacity
            onPress={() => {
              setSelectedPhoto('');
            }}
            style={[{marginEnd: 6}]}>
            {selectedPhoto === '' ? (
              <NoneBg isColored={true} />
            ) : (
              <NoneBg isColored={false} />
            )}
          </TouchableOpacity>
          {galleryImageList.map((itemData, index) => {
            if (itemData.node.image.uri) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPhoto(itemData.node.image.uri);
                  }}
                  style={[{marginEnd: 6}]}
                  key={`create_emolike_image_${index}`}>
                  <Image
                    source={{uri: itemData.node.image.uri}}
                    style={[
                      {
                        width: 48,
                        height: 48,
                        borderRadius: 10,
                        margin: 1,
                      },
                    ]}
                  />
                  {selectedPhoto === itemData.node.image.uri && (
                    <View style={{position: 'absolute', top: 16, left: 16}}>
                      <SelectedIcon />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }
          })}
        </ScrollView>
      </View>
    );
  };

  const renderEmojiView = () => {
    return (
      <View style={styles.emojiView}>
        <View style={styles.emojiHeader}>
          <Text style={styles.selectEmojiTxt}>Select Emoji</Text>
          {renderSearchEmoji()}
        </View>

        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              if (searchText) {
                searchEmoji(searchText, false);
              } else {
                loadEmoji();
              }
            }
          }}
          scrollEventThrottle={500}>
          <View style={{flexDirection: 'row', flexGrow: 1, flexWrap: 'wrap'}}>
            {(searchText === '' ? arrEmoji : arrSearchEmoji).map(
              (item, index) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.emojiItemDefault,
                      selectedEmojiIndex == index && {
                        borderColor: '#FF6651',
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => {
                      setSelectedEmoji(item);
                      setSelectedEmojiIndex(index);
                    }}
                    key={`create_emolike_emoji_${index}`}>
                    <Image
                      source={{uri: item.image}}
                      style={[{width: 25, height: 25}]}
                    />
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSearchEmoji = () => {
    return (
      <SearchBar
        value={searchText}
        txtPlaceholder="Search here..."
        onChangedText={setSearchText}
        theme={'gray'}
        style={{
          backgroundColor: '#ffffff',
          width: 200,
          height: 40,
          marginEnd: -10,
        }}
      />
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={{height: 0}}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={false}
      enableDismissOnClose={true}
      onDismiss={onClose}>
      <View style={[StyleSheet.absoluteFill]}>
        <View style={styles.body}>
          {renderHeader()}
          {renderPlayerView()}
          {renderBgList()}
          {renderEmojiView()}
          {loading ? (
            <TouchableOpacity style={styles.saveBtn}>
              <ActivityIndicator color={'white'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveBtn} onPress={onSaveEmolike}>
              <Text style={styles.saveBtnTxt}>Save Emolike</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginBottom: 20,
    width: 60,
    height: 2,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    paddingEnd: 48,
  },
  btnBack: {},
  txtTitle: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  playerView: {
    width: 186,
    height: 186,
    backgroundColor: '#494949',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  controlView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    height: 20,
    flex: 1,
    marginHorizontal: 4,
  },
  txtSliderTime: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 6,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.4,
  },
  emoView: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#F3F4F5',
    borderColor: '#010101',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiSelectedTxt: {
    fontSize: 35,
  },
  emojiView: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 24,
    padding: 12,
  },
  saveBtn: {
    width: '100%',
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  saveBtnTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectEmojiTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  emojiItemDefault: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F5',
    borderRadius: 40,
    marginEnd: 11,
    marginTop: 11,
  },
  emojiItemDefaultTxt: {
    fontSize: 24,
  },
  emojiItemSelected: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiItemSelectedTxt: {
    fontSize: 24,
  },
});

const BackIcon = () => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 18l-6-6 6-6"></Path>
  </Svg>
);

const PlayIcon = () => (
  <Svg width="19" height="19" fill="none" viewBox="0 0 19 19">
    <Rect
      width="18.202"
      height="18.202"
      x="0.582"
      y="0.129"
      fill="#fff"
      fillOpacity="0.2"
      rx="9.101"></Rect>
    <Path
      fill="#fff"
      d="M12.163 8.093L8.5 5.993A1.297 1.297 0 006.554 7.13v4.217A1.297 1.297 0 008.5 12.469l3.663-2.1a1.296 1.296 0 000-2.246v-.03zm-.38 1.589l-3.663 2.13a.545.545 0 01-.538 0 .538.538 0 01-.27-.465V7.115a.538.538 0 01.808-.467l3.664 2.116a.539.539 0 010 .933v-.015z"></Path>
  </Svg>
);

const PauseIcon = () => (
  <Svg width="19" height="19" fill="none" viewBox="0 0 19 19">
    <Rect
      width="18.101"
      height="18.101"
      fill="#fff"
      fillOpacity="0.2"
      rx="9.05"></Rect>
    <Path
      fill="#fff"
      d="M10.55 5.3a1.125 1.125 0 00-1.125 1.126v5.25a1.125 1.125 0 002.25 0v-5.25A1.125 1.125 0 0010.55 5.3zm.375 6.376a.375.375 0 01-.75 0v-5.25a.375.375 0 11.75 0v5.25zM7.55 5.3a1.125 1.125 0 00-1.125 1.125v5.25a1.125 1.125 0 002.25 0v-5.25A1.125 1.125 0 007.55 5.3zm.375 6.375a.375.375 0 01-.75 0v-5.25a.375.375 0 01.75 0v5.25z"></Path>
  </Svg>
);

const NoneBg = ({isColored = false}) => (
  <Svg width="48" height="48" fill="none" viewBox="0 0 48 48">
    <Rect
      width="47"
      height="47"
      x="0.5"
      y="0.5"
      fill={isColored ? '#FF6651' : 'rgba(0, 0, 0, 0.1)'}
      fillOpacity="0.1"
      stroke={isColored ? '#FF6651' : 'rgba(0, 0, 0, 0.1)'}
      rx="7.5"></Rect>
    <G
      fill={isColored ? '#FF6651' : 'rgba(0, 0, 0, 0.1)'}
      clipPath="url(#clip0_16866_56132)">
      <Path d="M31.071 16.928a10.001 10.001 0 10-14.143 14.144A10.001 10.001 0 0031.071 16.93zM18.343 29.657a8 8 0 1111.314-11.314 8 8 0 01-11.314 11.314z"></Path>
      <Path d="M19.616 18.2l10.182 10.183c.338.337.587.736.693 1.107.106.371.06.685-.127.873-.188.187-.501.233-.873.127-.371-.106-.77-.355-1.107-.693L18.202 19.615c-.338-.338-.587-.736-.693-1.107-.106-.372-.06-.686.127-.873.188-.188.502-.234.873-.127.371.106.77.355 1.107.693z"></Path>
    </G>
    <Defs>
      <ClipPath id="clip0_16866_56132">
        <Path fill="#fff" d="M0 0H24V24H0z" transform="translate(12 12)"></Path>
      </ClipPath>
    </Defs>
  </Svg>
);

const CheckedIcon = () => (
  <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
    <Path
      fill="#fff"
      d="M12.473 4.807a.666.666 0 00-.946 0L6.56 9.78 4.473 7.687a.681.681 0 00-.946.98l2.56 2.56a.666.666 0 00.946 0l5.44-5.44a.668.668 0 000-.98z"></Path>
  </Svg>
);

const SelectedIcon = () => {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF6651',
        borderRadius: 20,
      }}>
      <CheckedIcon />
    </View>
  );
};
