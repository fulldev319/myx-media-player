import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export const TrendingPlaylistCard = ({data, OnDetail, onPlay, style = {}}) => {
  const [isLoadedSuccess, setIsLoadedSuccess] = useState(false);
  console.log(isLoadedSuccess);
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => OnDetail(data.item)}>
      <View>
        <View style={styles.animationView2}></View>
        <View
          style={[
            styles.animationView1,
            !isLoadedSuccess && styles.normalAnimationView1,
          ]}></View>
        <Image
          source={{uri: data.item.image}}
          onError={e => {
            setIsLoadedSuccess(false);
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtPlaylist}>PLAYLISTS</Text>
        <Text style={styles.txtName}>{data.item.title}</Text>
        <Text
          style={
            styles.txtDesc
          }>{`${data.item.trackNumber} songs • ${data.item.artistNumber} artists`}</Text>
      </View>
      <TouchableOpacity
        style={styles.actionContainer}
        onPress={() => onPlay(data.item)}>
        <PlayIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 10,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
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
  txtPlaylist: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginEnd: 10,
  },
  actionContainer: {
    padding: 10,
  },
  normalAnimationView1: {
    position: 'absolute',
    left: 0,
    top: -6,
    height: 76,
    width: 81,
    backgroundColor: '#515151',
    borderRadius: 10,
  },
  animationView1: {
    position: 'absolute',
    right: -5,
    left: 0,
    height: 64,
    marginTop: 6,
    backgroundColor: '#515151',
    borderRadius: 10,
  },
  animationView2: {
    position: 'absolute',
    right: -10,
    width: 50,
    height: 50,
    marginTop: 13,
    backgroundColor: '#292929',
    borderRadius: 10,
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
