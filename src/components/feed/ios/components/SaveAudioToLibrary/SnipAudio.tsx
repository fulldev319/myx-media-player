import {convertTimeFormat, SCREEN_WIDTH} from 'helper/utils';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {PanResponder, ScrollView, StyleSheet, Text, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {SnipWaveProgress} from './SnipWaveProgress';

const TrackUnitWidth = 4;
const DisplayWidth = SCREEN_WIDTH - 40;

export const SnipAudio = ({totalDuration, onUpdated}) => {
  const [audioDuration, setAudioDuration] = useState(totalDuration);
  const MINIMUM_TRIM_DURATION = 1; // minimum 1s
  const MAXIMUM_TRIM_DURATION = audioDuration > 5 ? 5 : audioDuration; // maximum 5s
  const TrackWidth = TrackUnitWidth * totalDuration;
  const [waveData, setWaveData] = useState([]);
  const [startPro, setStartPro] = useState(0);
  const [endPro, setEndPro] = useState(
    ((MAXIMUM_TRIM_DURATION * TrackUnitWidth) / TrackWidth) * 100,
  );
  const [playingEndPro, setPlayingEndPro] = useState(40);
  const [scrollOffSet, setScrollOffSet] = useState(0);

  const isScrollable = audioDuration > 100;
  const startTranslateX = useSharedValue(0);
  const endTranslateX = useSharedValue(
    isScrollable
      ? MAXIMUM_TRIM_DURATION * TrackUnitWidth
      : DisplayWidth * (MAXIMUM_TRIM_DURATION / audioDuration),
  );

  const minimumCutWidth = useSharedValue(
    isScrollable
      ? MINIMUM_TRIM_DURATION * TrackUnitWidth
      : DisplayWidth * (MINIMUM_TRIM_DURATION / audioDuration),
  );
  const maximumCutWidth = useSharedValue(
    isScrollable
      ? MAXIMUM_TRIM_DURATION * TrackUnitWidth
      : DisplayWidth * (MAXIMUM_TRIM_DURATION / audioDuration),
  );

  useEffect(() => {
    initWaveData();
  }, []);

  useEffect(() => {
    onUpdated(startPro, endPro);
  }, [startPro, endPro]);

  const initWaveData = () => {
    const waveCount = isScrollable ? parseInt(audioDuration) : 100;
    const waveList = Array(waveCount)
      .fill('')
      .map((_, index) => {
        const x = TrackUnitWidth * index;
        const height = 40 - Math.floor(Math.random() * 40);
        const y = (31 - height) / 2;

        return {
          x,
          y,
          height,
        };
      });

    setWaveData(waveList);
  };

  const startAnimatedStyle = useAnimatedStyle(() => {
    const left = interpolate(
      startTranslateX.value,
      [0, DisplayWidth],
      [0, DisplayWidth],
    );

    return {
      transform: [{translateX: left}],
    };
  });

  const endAnimatedStyle = useAnimatedStyle(() => {
    const left = interpolate(
      endTranslateX.value,
      [0, DisplayWidth],
      [0, DisplayWidth],
    );

    return {
      transform: [{translateX: left}],
    };
  });

  const startPanGestureEvent = useAnimatedGestureHandler({
    onActive: event => {
      if (event.absoluteX > endTranslateX.value || audioDuration < 2) {
        return;
      }
      startTranslateX.value = event.absoluteX;
    },
    onEnd: event => {
      ('worklet');

      const definedPosition = startTranslateX.value + maximumCutWidth.value;
      if (event.absoluteX > endTranslateX.value - minimumCutWidth.value) {
        endTranslateX.value = definedPosition;
        const progress =
          ((definedPosition + scrollOffSet) * 100) /
          (isScrollable ? TrackWidth : DisplayWidth);
        runOnJS(setEndPro)(progress > 100 ? 100 : progress);
      }

      if (endTranslateX.value - event.absoluteX > maximumCutWidth.value) {
        endTranslateX.value = definedPosition;
        const progress =
          ((definedPosition + scrollOffSet) * 100) /
          (isScrollable ? TrackWidth : DisplayWidth);
        runOnJS(setEndPro)(progress > 100 ? 100 : progress);
      }

      const progress =
        ((event.absoluteX + scrollOffSet) * 100) /
        (isScrollable ? TrackWidth : DisplayWidth);
      runOnJS(setStartPro)(progress > 100 ? 100 : progress);
    },
  });

  const endPanGestureEvent = useAnimatedGestureHandler({
    onActive: event => {
      if (
        event.absoluteX > DisplayWidth ||
        event.absoluteX < minimumCutWidth.value ||
        audioDuration < 2
      ) {
        return;
      }
      endTranslateX.value = event.absoluteX;
    },
    onEnd: event => {
      ('worklet');

      const definedPosition = endTranslateX.value - maximumCutWidth.value;
      if (
        event.absoluteX > DisplayWidth + 10 ||
        event.absoluteX < startTranslateX.value + minimumCutWidth.value
      ) {
        startTranslateX.value = definedPosition;
        const progress =
          ((definedPosition + scrollOffSet) * 100) /
          (isScrollable ? TrackWidth : DisplayWidth);
        runOnJS(setStartPro)(progress > 100 ? 100 : progress);
      }

      if (event.absoluteX - startTranslateX.value > maximumCutWidth.value) {
        startTranslateX.value = definedPosition;
        const progress =
          ((definedPosition + scrollOffSet) * 100) /
          (isScrollable ? TrackWidth : DisplayWidth);
        runOnJS(setStartPro)(progress > 100 ? 100 : progress);
      }

      const progress =
        ((event.absoluteX + scrollOffSet) * 100) /
        (isScrollable ? TrackWidth : DisplayWidth);
      runOnJS(setEndPro)(progress > 100 ? 100 : progress);
    },
  });

  const onScroll = xOffset => {
    const newStartPos = startTranslateX.value + xOffset;
    const newEndPos = endTranslateX.value + xOffset;
    const newStartPro = (newStartPos * 100) / TrackWidth;
    const newEndPro = (newEndPos * 100) / TrackWidth;

    setStartPro(newStartPro);
    setEndPro(newEndPro);
    setScrollOffSet(xOffset);
  };

  const renderTrackView = () => {
    return (
      <View style={styles.trackView}>
        <ScrollView
          horizontal={true}
          scrollEnabled={TrackWidth > DisplayWidth}
          showsHorizontalScrollIndicator={false}
          style={{
            width: DisplayWidth,
            height: 40,
          }}
          onScroll={event => {
            onScroll(event.nativeEvent.contentOffset.x);
          }}
          scrollEventThrottle={10}>
          <SnipWaveProgress
            startPro={startPro}
            endPro={endPro}
            // playingPro={playingEndPro}
            playingPro={0}
            waveList={waveData}
            width={!isScrollable ? DisplayWidth : TrackWidth}
          />
        </ScrollView>
        <PanGestureHandler onGestureEvent={startPanGestureEvent}>
          <Animated.View style={[styles.trimHandle, startAnimatedStyle]}>
            <LeftCutIcon />
          </Animated.View>
        </PanGestureHandler>
        <PanGestureHandler onGestureEvent={endPanGestureEvent}>
          <Animated.View style={[styles.trimHandle, endAnimatedStyle]}>
            <RightCutIcon />
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  };

  const renderTimeView = () => {
    return (
      <View style={styles.timeView}>
        <Text>
          <Text style={styles.snipTimeDefaultTxt}>Snipping audio from </Text>
          <Text style={styles.snipTimeDurationTxt}>
            {convertTimeFormat((audioDuration * startPro) / 100)}
          </Text>{' '}
          <Text style={styles.snipTimeDefaultTxt}>to</Text>{' '}
          <Text style={styles.snipTimeDurationTxt}>
            {convertTimeFormat((audioDuration * endPro) / 100)}
          </Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <CutIcon />
        <Text style={styles.txtSnipAudio}>Snip Audio</Text>
        <Text
          style={
            styles.txtDesc
          }>{`Select part that you want to save.\nMaximum 5 seconds`}</Text>
      </View>
      {renderTrackView()}
      {renderTimeView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  topView: {
    alignItems: 'center',
  },
  txtSnipAudio: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    marginTop: 16,
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.4,
  },
  trackView: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  trimHandle: {
    position: 'absolute',
    top: 0,
  },
  timeView: {marginTop: 24},

  snipTimeDefaultTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
    opacity: 0.4,
  },
  snipTimeDurationTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6651',
  },
});

const CutIcon = () => (
  <Svg width="25" height="24" fill="none" viewBox="0 0 25 24">
    <Path
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6.5 21a3 3 0 100-6 3 3 0 000 6zM6.5 9a3 3 0 100-6 3 3 0 000 6zM20.5 4L8.62 15.88M14.97 14.48L20.5 20M8.62 8.12L12.5 12"></Path>
  </Svg>
);

const LeftCutIcon = () => (
  <Svg width="8" height="40" fill="none" viewBox="0 0 8 48">
    <Path
      fill="#fff"
      stroke="#FF6651"
      d="M4 .5h3.5v47H4A3.5 3.5 0 01.5 44V4A3.5 3.5 0 014 .5z"></Path>
  </Svg>
);

const RightCutIcon = () => (
  <Svg width="8" height="40" fill="none" viewBox="0 0 8 48">
    <Path
      fill="#fff"
      stroke="#FF6651"
      d="M4 .5H.5v47H4A3.5 3.5 0 007.5 44V4A3.5 3.5 0 004 .5z"></Path>
  </Svg>
);
