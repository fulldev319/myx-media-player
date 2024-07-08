import {getDefaultAvatar} from 'helper/userHelpers';
import {convertTimeFormat} from 'helper/utils';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {PlayRedIcon} from './CardTrendingPlaylist';

export const CardCoolRadio = ({data}) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.desc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui urna odio
          feugiat risus.
        </Text>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomItemRow}>
            <View style={styles.twinImageView}>
              {data.images.length > 0 && (
                <Image
                  source={
                    data.images[0] === ''
                      ? getDefaultAvatar()
                      : {uri: data.images[0]}
                  }
                  style={styles.twinImageItem}
                />
              )}
              {data.images.length > 1 &&
                data.images.map((item, index) => {
                  if (index == 0) {
                    return <View />;
                  } else {
                    return (
                      <Image
                        source={
                          data.images[index] === ''
                            ? getDefaultAvatar()
                            : {uri: data.images[index]}
                        }
                        style={[styles.twinImageItem, {marginLeft: -12}]}
                      />
                    );
                  }
                })}
            </View>
          </View>
          <View style={styles.bottomItemRow}>
            <MusicIcon />
            <Text style={styles.bottomItemText}>{data.trackNumber} songs</Text>
          </View>
          <View style={styles.bottomItemRow}>
            <ClockIcon />
            <Text style={styles.bottomItemText}>
              {convertTimeFormat(data.duration)}
            </Text>
          </View>
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
    width: '100%',
    height: 150,
    marginBottom: 12,
  },
  subContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    padding: 16,
    paddingEnd: 40,
    marginEnd: 10,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 18,
    fontWeight: '600',
    color: '#010101',
  },
  desc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: '#010101',
    opacity: 0.6,
    marginTop: 16,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  bottomItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginEnd: 16,
  },
  bottomItemText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '400',
    color: '#010101',
    opacity: 0.6,
    marginStart: 6,
  },
  playBtn: {
    position: 'absolute',
    right: 0,
    top: 50,
  },
  twinImageView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  twinImageItem: {
    width: 30,
    height: 30,
    borderRadius: 46,
    borderWidth: 0,
    borderColor: 'white',
  },
});

const MusicIcon = () => (
  <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
    <Path
      stroke="#010101"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M6 12V3.333L14 2v8.667"></Path>
    <Path
      stroke="#010101"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M4 14a2 2 0 100-4 2 2 0 000 4zM12 12.667a2 2 0 100-4 2 2 0 000 4z"></Path>
  </Svg>
);

const ClockIcon = () => (
  <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
    <Path
      stroke="#010101"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334z"></Path>
    <Path
      stroke="#010101"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8 4v4l2.667 1.333"></Path>
  </Svg>
);
