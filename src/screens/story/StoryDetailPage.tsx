import {StackScreenProps} from '@react-navigation/stack';
import {RedTrash1Icon, WhiteCloseIcon} from 'assets/svg';
import {apiUpdateStoryBySeen} from 'helper/storyHelpers';
import {MainStackParams} from 'navigators';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';

const dummyStoryList = [
  {
    mediaType: 'video',
    mediaUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    labelArr: [
      {
        animRatio: 0,
        animX: 0,
        animY: 0,
        color: '#f37121',
        fontSize: 40,
        height: 74.28571319580078,
        originScreenHeight: 535.2380981445312,
        originScreenWidth: 411.4285583496094,
        text: 'test',
        textAlign: 'center',
        textBg: false,
        width: 100.57142639160156,
        x: 164.6216459274292,
        y: 107.6349983215332,
      },
    ],
    duration: 29,
  },
  {
    mediaType: 'video',
    mediaUrl:
      'https://player.vimeo.com/external/420239207.hd.mp4?s=9fa34fce5989c66f5edc65fc533f2d91085d7599&profile_id=174&oauth2_token_id=57447761',
    duration: 22,
  },
  {
    mediaType: 'image',
    mediaUrl:
      'https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?k=20&m=517188688&s=612x612&w=0&h=i38qBm2P-6V4vZVEaMy_TaTEaoCMkYhvLCysE7yJQ5Q=',
  },
  {
    mediaType: 'text',
    mediaUrl:
      'https://media.istockphoto.com/photos/aerial-view-of-misty-mountains-at-sunrise-picture-id1195458582?k=20&m=1195458582&s=612x612&w=0&h=gzpAJTwppTIEAhNbUaHnjuRQoYon0F4C87UQ3xXv1oU=',
    labelArr: [
      {
        animRatio: 0,
        animX: 0,
        animY: 0,
        color: '#f37121',
        fontSize: 40,
        height: 74.28571319580078,
        originScreenHeight: 535.2380981445312,
        originScreenWidth: 411.4285583496094,
        text: '6666',
        textAlign: 'center',
        textBg: false,
        width: 100.57142639160156,
        x: 164.6216459274292,
        y: 107.6349983215332,
      },
      {
        animRatio: 0,
        animX: 0,
        animY: 0,
        color: '#fff',
        fontSize: 40,
        height: 74.28571319580078,
        originScreenHeight: 535.2380981445312,
        originScreenWidth: 411.4285583496094,
        text: 'top',
        textAlign: 'center',
        textBg: false,
        width: 65.9047622680664,
        x: 162.37115716934204,
        y: -18.2738037109375,
      },
      {
        animRatio: 0,
        animX: 0,
        animY: 0,
        color: 'red',
        fontSize: 40,
        height: 74.28571319580078,
        originScreenHeight: 535.2380981445312,
        originScreenWidth: 411.4285583496094,
        text: 'tl',
        textAlign: 'center',
        textBg: false,
        width: 32.380950927734375,
        x: 15.436569213867188,
        y: 2.5811424255371094,
      },
    ],
  },
];

const StoryDetailPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {data} = route.params;
  const userData = data.user;

  const {width} = Dimensions.get('window');
  const progressAnimationValue = useRef(new Animated.Value(0)).current;
  const progressBarWidth = width * 0.855;
  const activeProgressWidth = progressAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, progressBarWidth],
  });

  const arrStory = data.resultStories;
  let lastSeenStoryId = data.lastSeen;
  const [isInitialized, setIsInitialized] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isSetSize, setIsSetSize] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const timerRef = useRef(0);
  const imageTimerRef = useRef(null);
  const [shouldReloadScreen, setShouldReloadScreen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    goToLastSeenStory();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (storyIndex == 0) {
        timerRef.current = 0;
        progressAnimationValue.setValue(0);
      }

      if (arrStory[storyIndex].mediaType !== 'video') {
        startAnimation(5);
        startNextTimer();
      } else {
        setShouldReloadScreen(true);
        setShouldReloadScreen(false);
      }
    }
  }, [storyIndex, isInitialized]);

  const goToLastSeenStory = () => {
    arrStory.forEach((story, index) => {
      if (story.id === lastSeenStoryId) {
        if (index < arrStory.length - 2) {
          goToStory(index + 1);
        } else {
          goToStory(0);
        }
      }
    });
  };

  const goToStory = selectedStoryIndex => {
    let lastSeenTotalTime = 0;
    let sumTime = 0;

    arrStory.forEach(story => {
      sumTime += story.mediaType === 'video' ? story.duration : 5;
    });

    arrStory.forEach((story, index) => {
      if (index === selectedStoryIndex) {
        if (!isInitialized) {
          timerRef.current = timerRef.current + lastSeenTotalTime / sumTime;
        }

        progressAnimationValue.setValue(lastSeenTotalTime / sumTime);
        progressAnimationValue.stopAnimation();
        setIsInitialized(true);
        setStoryIndex(selectedStoryIndex);
      }

      lastSeenTotalTime += story.mediaType === 'video' ? story.duration : 5;
    });
  };

  const startNextTimer = () => {
    if (imageTimerRef != null) {
      clearTimeout(imageTimerRef.current);
    }

    imageTimerRef.current = setTimeout(() => {
      onNextStory();
    }, 5000);
  };

  const startAnimation = useCallback((duration: number) => {
    let sumTime = 0;
    arrStory.forEach(story => {
      sumTime += story.mediaType === 'video' ? story.duration : 5;
    });

    timerRef.current = timerRef.current + duration / sumTime;
    Animated.timing(progressAnimationValue, {
      toValue: timerRef.current,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start(({finished}) => {
      progressAnimationValue.stopAnimation();
    });
  }, []);

  const onNextStory = () => {
    if (storyIndex <= arrStory.length - 2) {
      goToStory(storyIndex + 1);
    }

    if (storyIndex == arrStory.length - 1) {
      goToStory(0);
    }

    onSeenByUser(arrStory[storyIndex].id);
  };

  const onPrevStory = () => {
    if (storyIndex > 0) {
      goToStory(storyIndex - 1);
    } else {
      goToStory(arrStory.length - 1);
    }
  };

  const onCloseStory = () => {
    if (imageTimerRef != null) {
      clearTimeout(imageTimerRef.current);
    }

    navigation.pop();
  };

  const onSeenByUser = storyId => {
    apiUpdateStoryBySeen(storyId);
  };

  const onRemoveStory = () => {};

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerBody}>
          <View style={styles.userInfo}>
            <Image
              source={require('./../../assets/sample/friend_001.png')}
              style={styles.userImage}
            />
            <Text style={styles.userName}>{userData.username}</Text>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionItems}>
              <RedTrash1Icon />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionItems, {paddingRight: 0}]}
              onPress={onCloseStory}>
              <WhiteCloseIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressBar}>
        {renderProgressBarPieces()}
        <Animated.View
          style={[styles.activeProgress, {width: activeProgressWidth}]}
        />
      </View>
    );
  };

  const renderProgressBarPieces = () => {
    let sumTime = 0;
    arrStory.forEach(story => {
      sumTime += story.mediaType === 'video' ? story.duration : 5;
    });

    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            flexDirection: 'row',
          },
        ]}>
        {arrStory.map((item, index) => {
          return (
            <View
              style={{
                width: `${
                  (item.mediaType === 'video'
                    ? item.duration / sumTime
                    : 5 / sumTime) * 100
                }%`,
                height: '100%',
              }}>
              <View
                style={{
                  marginStart: index === 0 ? 0 : 2,
                  marginEnd: index === arrStory.length - 1 ? 0 : 2,
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.32)',
                }}></View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.btnNextContainer}>
        <TouchableOpacity
          style={styles.btnNext}
          onPress={onNextStory}></TouchableOpacity>
      </View>
    );
  };

  const renderPrevButton = () => {
    return (
      <View style={styles.btnPrevContainer}>
        <TouchableOpacity
          style={styles.btnPrev}
          onPress={onPrevStory}></TouchableOpacity>
      </View>
    );
  };

  const renderVideoStory = () => {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Video
          ref={videoRef}
          source={{uri: arrStory[storyIndex].mediaUrl}}
          resizeMode={'cover'}
          style={styles.videoStoryContainer}
          onEnd={() => {
            console.log('---- onEnd');
            // videoRef.current.seek(0);
            onNextStory();
          }}
          onLoadStart={() => {
            console.log('--- onLoadStart');
          }}
          onReadyForDisplay={() => {
            startAnimation(arrStory[storyIndex].duration);
            console.log('--- onReadyForDisplay');
          }}
        />
      </View>
    );
  };

  const renderImageStory = () => {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Image
          source={{uri: arrStory[storyIndex].mediaUrl}}
          resizeMode={'cover'}
          style={styles.videoStoryContainer}
        />
      </View>
    );
  };

  const renderTextStory = () => {
    return (
      <View style={[StyleSheet.absoluteFill]}>
        <ImageBackground
          source={require('./../../assets/images/bg_media_text.png')}
          resizeMode={'cover'}
          style={[StyleSheet.absoluteFill]}
          borderRadius={37}
        />
      </View>
    );
  };

  const renderLabels = () => {
    if (arrStory[storyIndex].labelArr) {
      return (
        <View style={StyleSheet.absoluteFill}>
          {arrStory[storyIndex].labelArr.map(label => {
            let xConvertRatio = screenWidth / label.originScreenWidth;
            let yConvertRatio = screenHeight / label.originScreenHeight;

            return (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  padding: 5,
                  transform: [
                    {
                      translateX: label.x * xConvertRatio,
                    },
                    {
                      translateY: label.y * yConvertRatio,
                    },
                  ],
                }}>
                <Text
                  style={{
                    textAlign:
                      label.textAlign === 'flex-start'
                        ? 'left'
                        : label.textAlign === 'flex-end'
                        ? 'right'
                        : 'center',
                    fontSize: 40 * xConvertRatio,
                    fontWeight: '800',
                    color: label.textBg ? '#000' : label.color,
                  }}>
                  {label.text}
                </Text>
              </Animated.View>
            );
          })}
        </View>
      );
    } else {
      return <View />;
    }
  };

  return (
    <View style={styles.root}>
      {shouldReloadScreen ? (
        <View />
      ) : (
        <View
          style={styles.storyContainer}
          onLayout={event => {
            let {width, height} = event.nativeEvent.layout;
            if (!isSetSize) {
              setScreenWidth(width);
              setScreenHeight(height);
              setIsSetSize(true);
            }
          }}>
          {arrStory[storyIndex].mediaType === 'video'
            ? renderVideoStory()
            : arrStory[storyIndex].mediaType === 'image'
            ? renderImageStory()
            : renderTextStory()}
          {renderLabels()}

          {renderProgressBar()}
          {renderHeader()}
          {renderNextButton()}
          {renderPrevButton()}
        </View>
      )}

      <View style={styles.sendMessageContainer}></View>
    </View>
  );
};

export default StoryDetailPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  headerBody: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  userInfo: {flexDirection: 'row', alignItems: 'center'},
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 8,
    color: '#FFFFFF',
    marginStart: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItems: {
    padding: 5,
  },
  storyContainer: {
    flex: 1,
    width: '95%',
    marginHorizontal: '2.5%',
    marginTop: 30,
  },
  btnNextContainer: {
    width: 100,
    height: '100%',
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  btnPrevContainer: {
    width: 100,
    height: '100%',
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
  },
  btnNext: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  btnPrev: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sendMessageContainer: {
    width: '100%',
    height: 100,
  },
  videoStoryContainer: {flex: 1, width: '100%', borderRadius: 37},
  textStoryContainer: {
    borderRadius: 37,
  },
  progressBar: {
    width: '90%',
    height: 2,
    // backgroundColor: 'rgba(255, 255, 255, 0.32)',
    borderRadius: 1,
    position: 'absolute',
    top: 20,
    marginStart: '5%',
  },
  activeProgress: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
});
