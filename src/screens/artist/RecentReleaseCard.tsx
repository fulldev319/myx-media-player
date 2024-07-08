import {PlayingStatus, useTracks} from 'contexts/TrackContext';
import {convertTimeFormat} from 'helper/utils';
import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Svg, {Path} from 'react-native-svg';
import {
  MiniPauseIcon,
  MiniPlayIcon,
} from 'screens/MusicPlayer/components/musicPlayerIcons';

export const RecentReleaseCard = ({data, style = {}, togglePlay}) => {
  const {curTrack, playingStatus} = useTracks();
  return (
    <TouchableOpacity onPress={togglePlay} style={[styles.container, style]}>
      <Image
        source={{
          uri: data.item.image,
        }}
        style={styles.image}
      />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtDuration}>
          {convertTimeFormat(data.item.duration)}
        </Text>
        <Text style={styles.txtName} ellipsizeMode="tail" numberOfLines={1}>
          {data.item.title}
        </Text>
        <Text style={styles.txtDesc} ellipsizeMode="tail" numberOfLines={1}>
          {data.item.artists ? data.item.artists[0] : ''}
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
    height: 84,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
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

const PlayIcon = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fill="#fff"
      d="M12 2c5.512 0 10 4.486 10 10.006C22 17.514 17.512 22 12 22S2 17.514 2 12.006C2 6.486 6.488 2 12 2zm-1.139 6.03c-.212 0-.415.048-.608.145a1.251 1.251 0 00-.54.598c-.068.173-.174.694-.174.704-.107.57-.164 1.495-.164 2.518 0 .976.057 1.862.144 2.441.01.01.116.656.232.878.212.405.627.656 1.071.656h.039c.29-.01.898-.26.898-.27 1.023-.425 3.04-1.746 3.851-2.624l.058-.058c.106-.106.241-.27.27-.309.155-.202.232-.453.232-.703 0-.281-.087-.542-.251-.754-.039-.038-.184-.202-.319-.337-.791-.85-2.857-2.239-3.938-2.663-.164-.067-.579-.212-.801-.222z"
      opacity="0.3"
    />
  </Svg>
);
