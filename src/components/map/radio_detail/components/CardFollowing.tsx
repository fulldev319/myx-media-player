import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';
import {PlayRedIcon} from './CardTrendingPlaylist';

export const CardFollowing = () => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <Image source={getDefaultAvatar()} style={styles.userImage} />
          <Text style={styles.headerTxt}>
            Adrain <Text style={styles.headerSubTxt}>is listening to</Text>
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Midnight Jams</Text>
          <Text style={styles.desc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </Text>
        </View>
        <View style={[styles.centerRow, {marginTop: 12}]}>
          <HeadphoneIcon />
          <Text style={styles.txtListen}>12,405</Text>
        </View>
      </View>
      <View style={styles.playBtn}>
        <PlayRedIcon />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 225,
    height: 185,
    marginEnd: 12,
    borderRadius: 16,
    paddingBottom: 0,
  },
  subContainer: {
    width: 210,
    height: 170,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    height: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 102, 81, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  userImage: {
    width: 16,
    height: 16,
    borderRadius: 16,
  },
  headerTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '500',
    color: '#010101',
    marginStart: 10,
  },
  headerSubTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '500',
    color: '#010101',
    opacity: 0.4,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: '600',
    color: '#010101',
    marginTop: 8,
  },
  desc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: '#010101',
    marginTop: 8,
    opacity: 0.6,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtListen: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: '#010101',
    opacity: 0.4,
    marginStart: 4,
  },
  playBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

const MicIcon = () => (
  <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
    <G
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      clipPath="url(#clip0_16463_3399)"
      opacity="0.4">
      <Path d="M8 .667a2 2 0 00-2 2V8a2 2 0 104 0V2.667a2 2 0 00-2-2v0z"></Path>
      <Path d="M12.667 6.667V8a4.666 4.666 0 11-9.334 0V6.667M8 12.667v2.666M5.333 15.333h5.334"></Path>
    </G>
    <Defs>
      <ClipPath id="clip0_16463_3399">
        <Path fill="#fff" d="M0 0H16V16H0z"></Path>
      </ClipPath>
    </Defs>
  </Svg>
);

const HeadphoneIcon = () => (
  <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
    <G
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      opacity="0.4">
      <Path d="M2 12V8a6 6 0 1112 0v4"></Path>
      <Path d="M14 12.667A1.334 1.334 0 0112.667 14H12a1.333 1.333 0 01-1.333-1.333v-2A1.333 1.333 0 0112 9.333h2v3.334zm-12 0A1.333 1.333 0 003.333 14H4a1.334 1.334 0 001.333-1.333v-2A1.333 1.333 0 004 9.333H2v3.334z"></Path>
    </G>
  </Svg>
);
