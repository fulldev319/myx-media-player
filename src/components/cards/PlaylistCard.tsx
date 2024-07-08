import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

export const PlaylistCard = ({item}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imageBg01} />
        <View style={styles.imageBg02} />
        <Image
          style={styles.image}
          source={{uri: item.image}}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.typo01}>PLAYLISTS</Text>
        <Text style={styles.typo02}>{item.title}</Text>
        <Text style={styles.typo03}>
          {item.trackNumber ?? 0} songs • {item.artistNumber ?? 0} artists
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
  },
  imageContainer: {
    width: 90,
    height: 76,
    alignItems: 'center',
  },
  imageBg01: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 13,
    left: 40,
    backgroundColor: '#292929',
    borderRadius: 10,
  },
  imageBg02: {
    position: 'absolute',
    width: 64,
    height: 64,
    top: 6,
    left: 19,
    backgroundColor: '#515151',
    borderRadius: 10,
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 76,
    left: 0,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  typo01: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  typo02: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
  },
  typo03: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
