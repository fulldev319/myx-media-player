import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {convertTimeFormat} from 'helper/utils';
import {PlayIcon} from './TrendMusicCard';
import {PlayingStatus, useTracks} from 'contexts/TrackContext';
import {
  MiniPauseIcon,
  MiniPlayIcon,
} from 'screens/MusicPlayer/components/musicPlayerIcons';

export const MusicCard = ({data, togglePlay, style = {}}) => {
  const {curTrack, playingStatus} = useTracks();
  return (
    <TouchableOpacity onPress={togglePlay} style={[styles.container, style]}>
      <Image source={{uri: data.item.image}} style={styles.image} />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtDuration}>
          {convertTimeFormat(data.item.duration)}
        </Text>
        <Text style={styles.txtName} ellipsizeMode="tail" numberOfLines={1}>
          {data.item.title}
        </Text>
        <Text style={styles.txtDesc} ellipsizeMode="tail" numberOfLines={1}>
          {data.item.artists[0]}
        </Text>
      </View>
      <View style={styles.playIcon}>
        {curTrack?.id === data.item.id ? (
          playingStatus === PlayingStatus.Loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : playingStatus === PlayingStatus.Playing ? (
            <MiniPauseIcon />
          ) : (
            <MiniPlayIcon />
          )
        ) : (
          <PlayIcon />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  numberText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  image: {
    width: 60,
    height: 60,
    // marginStart: 20,
    borderRadius: 4,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  txtDuration: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  txtName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playIcon: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
