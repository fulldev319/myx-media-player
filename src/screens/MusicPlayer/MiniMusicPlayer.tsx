import React from 'react';
import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import {PlayerTheme, useTracks} from 'contexts/TrackContext';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PlayButton} from './components/PlayButton';

export const MiniMusicPlayer = () => {
  const {curTrack, theme, togglePlayer, playingStatus, trackProgress} =
    useTracks();
  const {navigate} = useNavigation();

  return (
    <View
      style={[
        styles.root,
        theme === PlayerTheme.Light
          ? {backgroundColor: 'white'}
          : {backgroundColor: 'rgba(80, 80, 80, 0.3)'},
      ]}>
      {theme === PlayerTheme.Dark && (
        <BlurView style={StyleSheet.absoluteFill} blurAmount={36} />
      )}
      <View style={[styles.container]}>
        <TouchableOpacity
          style={[styles.info]}
          onPress={() => {
            navigate('FullMusicPlayer');
          }}>
          <Image
            source={{uri: curTrack.artwork}}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                theme === PlayerTheme.Light && {color: '#000000'},
              ]}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {curTrack.title}
            </Text>
            <Text
              style={[
                styles.description,
                theme === PlayerTheme.Light && {color: 'rgba(0, 0, 0, 0.6)'},
              ]}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {curTrack.artist}
            </Text>
          </View>
        </TouchableOpacity>
        <View>
          <PlayButton
            playingStatus={playingStatus}
            onClick={togglePlayer}
            progressValue={trackProgress}
            progressBarBGColor={
              theme !== PlayerTheme.Light
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(0, 0, 0, 0.3)'
            }
            progressBarTintColor={
              theme !== PlayerTheme.Light ? '#FFFFFF' : '#000000'
            }
            theme={theme}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 103,
    backgroundColor: 'rgba(80, 80, 80, 0.3)',
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  content: {
    paddingHorizontal: 12,
    flex: 1,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  description: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
