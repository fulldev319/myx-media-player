/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';
import {SCREEN_WIDTH} from 'helper/utils';
import {useTracks} from 'contexts/TrackContext';
import {useNavigation} from '@react-navigation/native';
import SearchIcon from 'assets/svg/HomeSearch';
import PlusIcon from 'assets/svg/HomePlus';
import HomeProfile from 'assets/svg/HomeProfile';
import RefreshCircleIcon from 'assets/svg/RefreshCircleIcon';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {HomePageBase} from './HomePageBase';
import {MyProfilePage} from 'screens/ProfilePage/MyProfilePage';
import {PageName, useAuth} from 'contexts/AuthContext';
import SwipeReconizer from 'react-native-swipe-gestures';
import {useToast} from 'native-base';

type ContextType = {
  translateY: number;
  state: string;
};

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 20,
  detectSwipeUp: false,
  detectSwipeDown: false,
};

export const HomePage = () => {
  const navigation = useNavigation();
  const {screenHeight, playTrackList} = useTracks();
  const toast = useToast();

  const translateY = useSharedValue(0);
  const {curPage, setCurPage, setCurFeedTab} = useAuth();

  useEffect(() => {
    // setCurPage(PageName.PROFILE);
    setCurFeedTab('Music');
  }, []);

  const pageHandle = () => {
    if (curPage === PageName.PROFILE) {
      translateY.value = withSpring(screenHeight);
    } else {
      translateY.value = withSpring(0);
    }
  };

  useEffect(() => {
    pageHandle();
  }, [curPage]);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: (event, context) => {
      'worklet';
      if (translateY.value > 50) {
        translateY.value = withSpring(screenHeight);
        runOnJS(setCurPage)(PageName.PROFILE);
      } else {
        translateY.value = withSpring(0);
        runOnJS(setCurPage)(PageName.NONE);
      }
    },
  });

  const touchStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [10, 20], [1, 0]);
    return {
      backgroundColor: `rgba(0, 0, 0, ${opacity})`,
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const avatarStyle = useAnimatedStyle(() => {
    if (translateY.value <= 200) {
      const value = interpolate(translateY.value, [0, 200], [-120, -50]);
      return {
        transform: [
          {
            translateY: value,
          },
          {
            translateX: SCREEN_WIDTH / 2 - 80,
          },
          {
            scaleX: 0.8,
          },
          {
            scaleY: 0.8,
          },
        ],
      };
    } else if (translateY.value <= 400) {
      const scale = interpolate(translateY.value, [200, 400], [0.8, 1]);
      const valueY = interpolate(translateY.value, [200, 400], [-50, 0]);
      const valueX = interpolate(
        translateY.value,
        [200, 400],
        [SCREEN_WIDTH / 2 - 80, 0],
      );
      return {
        transform: [
          {
            translateY: valueY,
          },
          {
            translateX: valueX,
          },
          {
            scaleX: scale,
          },
          {
            scaleY: scale,
          },
        ],
      };
    }
  });

  const infoStyle = useAnimatedStyle(() => {
    if (translateY.value <= 200) {
      return {
        opacity: 0,
      };
    } else if (translateY.value <= 400) {
      const opacity = interpolate(translateY.value, [200, 400], [0, 1]);
      const valueY = interpolate(translateY.value, [200, 400], [-50, 0]);
      const valueX = interpolate(
        translateY.value,
        [200, 400],
        [SCREEN_WIDTH / 2 - 80, 0],
      );
      return {
        opacity: opacity,
        transform: [
          {
            translateY: valueY,
          },
          {
            translateX: valueX,
          },
        ],
      };
    }
  });

  const btnStyle = useAnimatedStyle(() => {
    if (translateY.value <= 200) {
      return {
        opacity: 0,
      };
    } else if (translateY.value <= 400) {
      const opacity = interpolate(translateY.value, [200, 400], [0, 1]);
      return {
        opacity: opacity,
      };
    }
  });

  const onPressPlusIcon = () => {
    navigation.navigate('SelectSongPage');
  };

  const showHomePage = () => {
    setCurPage(PageName.NONE);
    // translateY.value = withSpring(0);
  };

  const onLeftSwitchSwipe = state => {};

  const onRightSwitchSwipe = state => {
    setCurFeedTab('Feed');
    navigation.navigate('Feed');
    playTrackList([]);
    toast.show({
      render: () => {
        return (
          <View style={styles.toast}>
            <Text style={styles.toastTxt}>Song changed to feed's song</Text>
          </View>
        );
      },
    });
  };

  return (
    <>
      <View style={StyleSheet.absoluteFill}>
        <MyProfilePage
          animStyle={{
            goBack: showHomePage,
            avatarStyle: avatarStyle,
            infoStyle: infoStyle,
            btnStyle: btnStyle,
          }}
        />
      </View>
      <Animated.View style={[styles.root, touchStyle]}>
        <View style={{position: 'absolute', top: 400, left: -4, zIndex: 5}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#010101',
              padding: 10,
              borderTopRightRadius: 32,
              borderBottomRightRadius: 32,
            }}
            onPress={() => {
              setCurFeedTab('Feed');
              navigation.navigate('Feed');
            }}>
            <SwipeReconizer
              config={swipeConfig}
              onSwipeLeft={onLeftSwitchSwipe}
              onSwipeRight={onRightSwitchSwipe}
              style={[StyleSheet.absoluteFill]}>
              <TouchableOpacity style={[StyleSheet.absoluteFill]} />
            </SwipeReconizer>
            <RefreshCircleIcon />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onPressPlusIcon}>
              <PlusIcon />
            </TouchableOpacity>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
              <Animated.View style={[styles.showProfile]}>
                <HomeProfile />
              </Animated.View>
            </PanGestureHandler>
            <TouchableOpacity
              onPress={() => navigation.navigate('ExplorePage')}>
              <SearchIcon />
            </TouchableOpacity>
          </View>
          <HomePageBase />
          <View style={{marginBottom: 50}} />
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    paddingTop: 40,
    backgroundColor: '#000000',
  },
  container: {
    paddingTop: 20,
    marginBottom: 80,
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  showProfile: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subTitle: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  subAction: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 3,
    width: 15,
    height: 15,
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    opacity: 1,
    color: 'red',
  },
  customSlide: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 40,
  },
  sliderInfoView: {
    position: 'absolute',
    bottom: 40,
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
  },
  sliderTitleText: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  sliderSubTitleText: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  toast: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastTxt: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 20,
  },
});
