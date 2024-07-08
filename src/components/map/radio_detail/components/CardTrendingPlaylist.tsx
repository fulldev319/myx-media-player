import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path, Rect} from 'react-native-svg';

export const CardTrendingPlaylist = ({data}) => {
  if (data) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(255, 102, 81, 0.1)', 'rgba(126, 0, 225, 0.1)']}
          useAngle={true}
          angle={180}
          style={[
            StyleSheet.absoluteFill,
            {borderRadius: 16, marginBottom: 25},
          ]}></LinearGradient>
        <View style={styles.topImageView}>
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
        <View style={styles.infoView}>
          <Text style={styles.txtTitle}>{data.title}</Text>
          {/* <Text style={styles.txtDesc}>
            Lorem ipsum dolor sit amet, consecetu
          </Text> */}
          <View style={styles.infoPlayRow}>
            <SmallPlayIcon />
            <Text style={styles.txtPlays}>{`${data.listeners} plays`}</Text>
          </View>
        </View>
        <View style={styles.btnPlay}>
          <PlayRedIcon />
        </View>
      </View>
    );
  } else {
    return <View />;
  }
};

const styles = StyleSheet.create({
  container: {
    width: 210,
    height: 200,
    marginEnd: 12,
    borderRadius: 16,
    padding: 8,
    paddingBottom: 0,
  },
  topImageView: {
    marginTop: 12,
    alignItems: 'center',
  },
  twinImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  twinImageItem: {
    width: 46,
    height: 46,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: 'white',
  },
  infoView: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: 25,
  },
  txtTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: '600',
    color: '#010101',
    textAlign: 'center',
    padding: 8,
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: '#010101',
    textAlign: 'center',
    opacity: 0.6,
    marginHorizontal: 20,
  },
  infoPlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  txtPlays: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '400',
    color: '#010101',
    textAlign: 'center',
    opacity: 0.6,
    marginStart: 5,
  },
  btnPlay: {
    position: 'absolute',
    bottom: 0,
    left: 80,
  },
});

const SmallPlayIcon = props => (
  <Svg width="17" height="16" fill="none" viewBox="0 0 17 16">
    <Path
      fill="#010101"
      d="M8.5 1.333c3.675 0 6.667 2.991 6.667 6.67 0 3.673-2.992 6.664-6.667 6.664-3.674 0-6.667-2.991-6.667-6.663 0-3.68 2.993-6.67 6.667-6.67zm-.76 4.02a.895.895 0 00-.405.097.834.834 0 00-.36.399 4.299 4.299 0 00-.116.469c-.07.38-.11.997-.11 1.679 0 .65.04 1.241.097 1.627.007.006.078.437.155.585a.81.81 0 00.714.438h.026c.193-.007.598-.174.598-.18.682-.283 2.027-1.165 2.568-1.75l.038-.038c.071-.071.161-.18.18-.206a.812.812 0 00-.013-.971c-.025-.026-.121-.136-.212-.226-.527-.566-1.904-1.492-2.625-1.775-.11-.044-.386-.141-.534-.148z"
      opacity="0.2"></Path>
  </Svg>
);

export const PlayRedIcon = () => (
  <Svg width="49" height="48" fill="none" viewBox="0 0 49 48">
    <Rect width="48" height="48" x="0.5" fill="#fff" rx="24"></Rect>
    <Path
      fill="#FF6651"
      d="M24.5 10.667c7.349 0 13.333 5.981 13.333 13.34 0 7.345-5.984 13.326-13.333 13.326s-13.334-5.981-13.334-13.325c0-7.36 5.985-13.341 13.334-13.341zm-1.519 8.04a1.79 1.79 0 00-.81.192c-.322.18-.58.464-.721.798-.09.232-.232.926-.232.94-.142.758-.219 1.993-.219 3.357 0 1.3.077 2.482.193 3.254.013.013.155.875.31 1.17.282.541.836.876 1.428.876h.051c.386-.013 1.197-.348 1.197-.36 1.364-.567 4.054-2.33 5.135-3.5l.077-.077a5.31 5.31 0 00.36-.412 1.55 1.55 0 00.31-.937c0-.375-.116-.722-.335-1.005-.051-.051-.245-.27-.425-.45-1.055-1.132-3.81-2.985-5.25-3.55-.22-.09-.773-.284-1.069-.296z"></Path>
    <Rect
      width="47"
      height="47"
      x="1"
      y="0.5"
      stroke="#000"
      strokeOpacity="0.1"
      rx="23.5"></Rect>
  </Svg>
);
