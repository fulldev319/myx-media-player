import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {EmojiLikeIcon, LeftBackIcon} from 'screens/thread/assets/svgs';
import Video from 'react-native-video';
import {Slider} from '@miblanchard/react-native-slider';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  apiGetFictionMyEmoji,
  apiAddEmolikeToDebate,
} from 'helper/fictionHelper';
import SUCCESS_THREAD_BG from 'assets/images/emolikes_succes_bg.png';
import {generateComponentKey, SCREEN_HEIGHT, SCREEN_WIDTH} from 'helper/utils';
import {EmojiWaveProgress} from 'components/feed/ios/create_emolike_flow/WaveProgress';
import Svg, {Path, Rect} from 'react-native-svg';
import {ExpandEmolike} from 'components/common/ExpandEmolike';
import {styles} from './index.styles';

export const EmolikePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {debateId} = route.params;
  const isFromDebate = debateId !== undefined;

  const [emolikes, setEmolikes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedEmolike, setSelectedEmolike] = useState(null);

  const [successViewFadeAnim] = useState(new Animated.Value(0));
  const [showSuccessCreatedView, setShowSuccessCreatedView] = useState(false);

  const videoRef = useRef(null);
  const [audioPaused, setAudioPaused] = useState(true);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    loadMyEmolikes();
  }, []);

  const loadMyEmolikes = async () => {
    let hasMore = false;
    let lastId = 0;
    do {
      const params = {
        offset: 0,
        limit: 10,
      };
      const res = await apiGetFictionMyEmoji(params);

      if (res.success) {
        setEmolikes(prev => [...prev, ...res.data]);
      }
      hasMore = res.hasMore;
      lastId = res.lastId;
    } while (hasMore);
  };

  const onAddToDebate = async () => {
    if (selectedEmolike && !isSaving) {
      setIsSaving(true);
      const res = await apiAddEmolikeToDebate(
        debateId,
        selectedEmolike.url == null
          ? 'https://ipfs.filebase.io/ipfs/QmY9bqVN5hPRgfoZn3jcDdL1CCotUqyGatb7jGyMRjEceD'
          : selectedEmolike.url,
        selectedEmolike.emolike_id,
      );

      if (res.success) {
        onShowSuccessEmolike();
      }
      setIsSaving(false);
    }
  };

  const onShowSuccessEmolike = () => {
    Animated.timing(successViewFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setShowSuccessCreatedView(true);
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftBackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emolikes</Text>
        <View />
      </View>
    );
  };

  const renderSuccessView = () => {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: successViewFadeAnim,
          },
        ]}>
        <View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.9)'},
          ]}>
          <Image
            source={SUCCESS_THREAD_BG}
            style={[
              StyleSheet.absoluteFill,
              {width: SCREEN_WIDTH, height: SCREEN_HEIGHT},
            ]}
          />
          <View style={styles.successContainer}>
            <Text style={styles.successTxtContainer}>
              {`✅\n`}
              <Text style={styles.successTxt}>Success Adding Emolike!</Text>
            </Text>
            {renderPlayerView()}
            <TouchableOpacity
              style={styles.successViewDismiss}
              onPress={() => {
                successViewFadeAnim.setValue(0);
                setShowSuccessCreatedView(false);
                navigation.goBack();
              }}>
              <Text style={styles.successViewDismissTxt}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderPlayerView = () => {
    return (
      <View style={styles.playerView}>
        <View style={[StyleSheet.absoluteFill, {borderRadius: 16}]}>
          {selectedEmolike && (
            <Video
              source={{uri: selectedEmolike.url}}
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
          )}
          <LinearGradient
            useAngle={true}
            angle={180}
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
            style={[StyleSheet.absoluteFill, {borderRadius: 16}]}
          />
        </View>
        <EmojiWaveProgress />
        {renderPlayControl()}
        <View style={styles.emoView}>
          <Image
            source={{uri: selectedEmolike.emojiImage}}
            style={[{width: 35, height: 35}]}
          />
        </View>
      </View>
    );
  };

  const onPlaySuccessEmolike = () => {
    setAudioPaused(false);
  };

  const renderPlayControl = () => {
    return (
      <View style={styles.controlView}>
        <TouchableOpacity onPress={onPlaySuccessEmolike}>
          {audioPaused ? <PlayIcon /> : <PauseIcon />}
        </TouchableOpacity>
        <Slider
          containerStyle={styles.slider}
          minimumValue={0}
          maximumValue={100}
          onSlidingComplete={() => {}}
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

  return (
    <View style={styles.body}>
      <View style={styles.indicator} />
      <View style={styles.content}>
        <Header />
        <ScrollView contentContainerStyle={{flex: 1, paddingBottom: 100}}>
          <View style={styles.emolikesContainer}>
            {emolikes.map((emolike, index) => {
              return (
                <ExpandEmolike
                  emolike={emolike}
                  index={index}
                  isSelected={index === selectedIndex}
                  onClick={data => {
                    isFromDebate && setSelectedIndex(index);
                    isFromDebate && setSelectedEmolike(data);
                  }}
                  key={`${generateComponentKey()}`}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
      {selectedEmolike && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => {
              onAddToDebate();
            }}>
            {isSaving && <ActivityIndicator color="white" />}
            {!isSaving && <EmojiLikeIcon />}
            {!isSaving && (
              <Text style={styles.newButtonTitle}>Add Emolike</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      {showSuccessCreatedView && renderSuccessView()}
    </View>
  );
};

const PlayIcon = () => (
  <Svg width="19" height="19" fill="none" viewBox="0 0 19 19">
    <Rect
      width="18.202"
      height="18.202"
      x="0.582"
      y="0.129"
      fill="#fff"
      fillOpacity="0.2"
      rx="9.101"
    />
    <Path
      fill="#fff"
      d="M12.163 8.093L8.5 5.993A1.297 1.297 0 006.554 7.13v4.217A1.297 1.297 0 008.5 12.469l3.663-2.1a1.296 1.296 0 000-2.246v-.03zm-.38 1.589l-3.663 2.13a.545.545 0 01-.538 0 .538.538 0 01-.27-.465V7.115a.538.538 0 01.808-.467l3.664 2.116a.539.539 0 010 .933v-.015z"
    />
  </Svg>
);

const PauseIcon = () => (
  <Svg width="19" height="19" fill="none" viewBox="0 0 19 19">
    <Rect
      width="18.101"
      height="18.101"
      fill="#fff"
      fillOpacity="0.2"
      rx="9.05"
    />
    <Path
      fill="#fff"
      d="M10.55 5.3a1.125 1.125 0 00-1.125 1.126v5.25a1.125 1.125 0 002.25 0v-5.25A1.125 1.125 0 0010.55 5.3zm.375 6.376a.375.375 0 01-.75 0v-5.25a.375.375 0 11.75 0v5.25zM7.55 5.3a1.125 1.125 0 00-1.125 1.125v5.25a1.125 1.125 0 002.25 0v-5.25A1.125 1.125 0 007.55 5.3zm.375 6.375a.375.375 0 01-.75 0v-5.25a.375.375 0 01.75 0v5.25z"
    />
  </Svg>
);
