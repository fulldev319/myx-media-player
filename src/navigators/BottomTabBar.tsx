import {PageName, useAuth} from 'contexts/AuthContext';
import {useTracks} from 'contexts/TrackContext';
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  withDelay,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import {MiniMusicPlayer} from 'screens/MusicPlayer/MiniMusicPlayer';

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import V2BottomTab from './BottomTabV2';
import {SCREEN_WIDTH} from 'helper/utils';

type ContextType = {
  translateX: number;
  state: string;
};

const BottomTabBar = props => {
  const {setCurPage} = useAuth();
  const {curTrack, showPlayer, playTrackList} = useTracks();
  const handleTabItemClick = route => {
    setCurPage(PageName.NONE);

    if (route === 'Plus') {
      props.navigation.push('SelectSongPage');
    } else {
      props.navigation.navigate(route);
    }
  };

  const [showingPlayer, setShowingPlayer] = useState(true);

  useEffect(() => {
    if (!showingPlayer) {
      clearTrack();
    }
  }, [showingPlayer]);

  const contextState = useSharedValue('left');
  const translateX = useSharedValue(0);
  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      if (event.translationX > 0) {
        context.state = 'right';
      } else {
        context.state = 'left';
      }

      context.translateX = translateX.value;
    },
    onActive: (event, context) => {
      if (context.state === 'right') {
        translateX.value = event.translationX;
      } else {
        translateX.value = event.translationX;
      }
    },
    onEnd: (event, context) => {
      'worklet';
      contextState.value = context.state;

      if (translateX.value > 150 || translateX.value < -150) {
        runOnJS(setShowingPlayer)(false);
        if (context.state === 'left') {
          translateX.value = withSpring(-SCREEN_WIDTH);
        } else {
          translateX.value = withSpring(SCREEN_WIDTH);
        }

        translateX.value = withDelay(1000, withTiming(0));
        runOnJS(setShowingPlayer)(true);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const clearTrack = () => {
    playTrackList([], '', '', false);
  };

  const swipeStyle = useAnimatedStyle(() => {
    'worklet';
    let marginLeft = translateX.value;

    if (contextState.value === 'left') {
      return {
        left: marginLeft,
      };
    } else {
      return {
        left: marginLeft,
      };
    }
  });

  const routeName = props.state.routes[props.state.index].name;

  return (
    <View style={{...styles.container}}>
      {curTrack && showPlayer && routeName !== 'Feed' && (
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[swipeStyle]}>
            <View style={styles.miniPlayer}>
              <MiniMusicPlayer />
            </View>
          </Animated.View>
        </PanGestureHandler>
      )}
      <View style={[styles.mainContainer]}>
        <V2BottomTab
          tab={'Feed'}
          onPress={handleTabItemClick}
          routeName={routeName}
        />
        <V2BottomTab
          tab={'ForYou'}
          onPress={handleTabItemClick}
          routeName={routeName}
        />
        <V2BottomTab
          tab={'Groups'}
          onPress={handleTabItemClick}
          routeName={routeName}
        />
      </View>
    </View>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  miniPlayer: {
    marginBottom: -20,
    width: '100%',
  },
  mainContainer: {
    paddingHorizontal: 24,
    backgroundColor: '#151515',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideTabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  centerTab: {},
});
