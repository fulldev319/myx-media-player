import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  BookMarkIcon,
  BookMarkSelIcon,
  FollowIcon,
  LikeIcon,
  MessageIcon,
  PauseIcon,
  PlayNextIcon,
  PlayPrevIcon,
} from 'assets/svg/mediaCardIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {WaveformIcon} from 'assets/svg/bottomNavIcons';

export const MediaCard = ({media = null, style = {}}) => {
  return (
    <View style={[styles.root, style]}>
      <Image
        source={media?.image}
        style={styles.background}
        resizeMode="cover"
      />
      <View style={[styles.container]}>
        <View style={[styles.bookMark]}>
          {media.bookMark ? <BookMarkSelIcon /> : <BookMarkIcon />}
        </View>
        <View style={[styles.info]}>
          <View style={[styles.actions]}>
            <View style={[styles.action]}>
              <Image
                source={media.artist.image}
                resizeMode="cover"
                style={styles.artistImage}
              />
              <Text style={styles.artistName}>{media.artist.name}</Text>
            </View>
            <View style={[styles.action, styles.interactive]}>
              <TouchableOpacity>
                <LikeIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <MessageIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <FollowIcon />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.desc}>{media.description}</Text>
          <WaveformIcon />
          <View style={[styles.playControl]}>
            <TouchableOpacity>
              <PlayPrevIcon />
            </TouchableOpacity>
            <View style={[styles.playIcon]}>
              <TouchableOpacity>
                <PauseIcon />
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <PlayNextIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: 410,
    position: 'relative',
    borderRadius: 30,
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bookMark: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  info: {
    paddingHorizontal: 25,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  action: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(1, 1, 1, 0.79)',
    alignItems: 'center',
  },
  interactive: {
    width: 86,
    justifyContent: 'space-evenly',
  },
  artistImage: {
    height: 22,
    width: 22,
    borderRadius: 15,
    marginHorizontal: 4,
  },
  artistName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 4,
    marginRight: 13,
  },
  desc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  playControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  playIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
