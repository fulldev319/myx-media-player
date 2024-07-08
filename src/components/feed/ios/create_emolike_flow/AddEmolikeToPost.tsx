import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Video from 'react-native-video';
import Svg, {Path, Rect} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import {Slider} from '@miblanchard/react-native-slider';

import {apiCreateEmoLikes, apiGetEmoLikes} from 'helper/emoLikesHelper';
import {EmojiWaveProgress} from './WaveProgress';

export const AddEmolikeToPostSheet = ({
  show,
  onClose,
  onContinue,
  onCreateNew,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [650, 650], []);
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [selectedAudioData, setSelectedAudioData] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioPaused, setAudioPaused] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [arrData, setArrData] = useState([]);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
      loadData(true);
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  const loadData = async (isRefresh = false) => {
    if (!isLoadingData) {
      const res = await apiGetEmoLikes(10, isRefresh ? null : lastId);

      if (res.success) {
        setLastId(res.lastId);
        setHasMore(res.hasMore);
        setArrData(res.data);
      }
    }
  };

  const onSave = async () => {
    if (selectedAudioData) {
      setLoading(true);
      const res = await apiCreateEmoLikes(
        selectedAudioData.emoji,
        selectedAudioData.url,
        selectedAudioData.debate,
      );

      if (res.success) {
        sheetRef.current.close();
        setTimeout(() => {
          onContinue(selectedAudioData.url, selectedAudioData.emojiImage);
        });
      }

      setLoading(false);
    }
  };

  const onPlay = () => {
    setAudioPaused(false);
  };

  const onSeek = time => {};

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => {
              sheetRef.current.close();

              setTimeout(() => {
                onClose();
              }, 500);
            }}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.txtTitle}>Add Emolike to Post</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            sheetRef.current.close();
            setTimeout(() => {
              onCreateNew();
            }, 500);
          }}>
          <Text style={styles.txtCreateNew}>Create New</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPlayerView = () => {
    return (
      <View style={styles.playerView}>
        <View style={[StyleSheet.absoluteFill, {borderRadius: 16}]}>
          <Video
            source={{uri: selectedAudioData.url}}
            ref={videoRef}
            paused={audioPaused}
            audioOnly={true}
            onLoadStart={() => setIsLoadingAudio(true)}
            onLoad={() => setIsLoadingAudio(false)}
            onError={() => setIsLoadingAudio(false)}
            onEnd={() => {
              setAudioPaused(true);
              setTimeout(() => {
                videoRef.current?.seek(0);
                setAudioProgress(0);
              }, 100);
            }}
            resizeMode={'cover'}
            onProgress={progress => {
              const currentPro =
                (progress.currentTime / progress.playableDuration) * 100;
              setAudioProgress(currentPro);
            }}
            style={[StyleSheet.absoluteFill, {borderRadius: 16}]}
          />
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
        <View style={styles.divider} />

        <View style={styles.emoView}>
          <Image
            source={{uri: selectedAudioData.emojiImage}}
            style={[{width: 35, height: 35}]}
          />
        </View>
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
        <Text style={styles.txtSliderTime}>0:05</Text>
      </View>
    );
  };

  const renderEmolikes = () => {
    return (
      <View style={styles.listEmolikes}>
        <Text style={styles.txtSelectEmolike}>Select Emolike</Text>
        <View style={{flex: 1, width: '100%'}}>
          <FlatList
            data={arrData}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <EmolikeItem
                data={item}
                isSelected={
                  selectedAudioData ? selectedAudioData.id === item.id : false
                }
                onSelect={data => setSelectedAudioData(data)}
              />
            )}
            keyExtractor={item => `${item.id}_${item.title}`}
            numColumns={3}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            style={{marginVertical: 0}}
          />
        </View>
      </View>
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
          {selectedAudioData && renderPlayerView()}
          {selectedAudioData && <View style={styles.divider} />}
          {renderEmolikes()}
          {loading ? (
            <TouchableOpacity style={styles.saveBtn}>
              <ActivityIndicator color={'white'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                onSave();
              }}>
              <Text style={styles.saveBtnTxt}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </BottomSheetModal>
  );
};

const EmolikeItem = ({data, isSelected, onSelect}) => {
  const videoRef = useRef(null);
  const [audioPaused, setAudioPaused] = useState(true);

  return (
    <TouchableOpacity style={styles.itemEmolike} onPress={() => onSelect(data)}>
      <Video
        source={{
          uri: data.url,
        }}
        ref={videoRef}
        paused={audioPaused}
        audioOnly={true}
        resizeMode={'cover'}
        style={[
          StyleSheet.absoluteFill,
          {borderRadius: 10},
          isSelected && {margin: 10},
        ]}
      />
      <View style={[styles.smallEmoView]}>
        <Image
          source={{uri: data.emojiImage}}
          style={[{width: 20, height: 20}]}
        />
      </View>
      {isSelected && (
        <View style={[StyleSheet.absoluteFill, styles.itemEmolikeBlur]} />
      )}
      {isSelected && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#FF6651',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CheckIcon />
          </View>
        </View>
      )}
    </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  btnBack: {},
  txtTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    marginStart: 20,
  },
  txtCreateNew: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6651',
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
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 20,
  },
  listEmolikes: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  txtSelectEmolike: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 10,
  },
  itemEmolike: {
    width: 100,
    height: 130,
    borderRadius: 16,
    marginTop: 10,
  },
  itemEmolikeBlur: {
    backgroundColor: 'white',
    opacity: 0.4,
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
  smallEmoView: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#F3F4F5',
    borderColor: '#010101',
    justifyContent: 'center',
    alignItems: 'center',
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

const CheckIcon = () => (
  <Svg width="32" height="32" fill="none" viewBox="0 0 32 32">
    <Path
      fill="#fff"
      d="M24.947 9.613a1.333 1.333 0 00-1.893 0L13.12 19.56l-4.173-4.187a1.363 1.363 0 00-1.893 1.96l5.12 5.12a1.332 1.332 0 001.893 0l10.88-10.88a1.332 1.332 0 000-1.96z"></Path>
  </Svg>
);
