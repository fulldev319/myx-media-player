import {PlayerTheme, PlayingStatus} from 'contexts/TrackContext';
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {MiniPauseIcon, MiniPlayIcon} from './musicPlayerIcons';
export const PlayButton = ({
  playingStatus,
  progressValue,
  onClick,
  size = 32,
  progressBarBGColor = 'rgba(255,255,255,0.3)',
  progressBarTintColor = '#FFFFFF',
  theme = PlayerTheme.Dark,
}) => {
  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <AnimatedCircularProgress
        fill={progressValue}
        tintColor={progressBarTintColor}
        backgroundColor={progressBarBGColor}
        size={size}
        width={3}
        rotation={0}
        style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0}}
      />
      <TouchableOpacity
        style={styles.playBtn}
        activeOpacity={0.7}
        onPress={onClick}>
        <View>
          {playingStatus === PlayingStatus.Loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : playingStatus === PlayingStatus.Playing ? (
            <MiniPauseIcon theme={theme} />
          ) : (
            <MiniPlayIcon theme={theme} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {},
  playBtnView: {},
});
