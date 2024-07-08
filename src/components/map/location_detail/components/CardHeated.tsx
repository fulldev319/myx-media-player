import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';

export const CardHeated = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Image source={getDefaultAvatar()} style={styles.postImage} />
        <View>
          <PlayIcon />
        </View>
      </View>
      <View style={{marginTop: 12}}>
        <Text style={styles.title}>Rio Alexis in Urland</Text>
        <Text style={styles.desc}>Rio, Andra, Pam and 11 others</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomItemContainer}>
          <UpIcon />
          <View style={styles.bottomItemRight}>
            <Text style={styles.txtAgreeNumber}>213</Text>
            <Text style={styles.txtAgreed}>agreed</Text>
          </View>
        </View>
        <View style={styles.bottomItemContainer}>
          <DownIcon />
          <View style={styles.bottomItemRight}>
            <Text style={styles.txtAgreeNumber}>64</Text>
            <Text style={styles.txtAgreed}>agreed</Text>
          </View>
        </View>
        <PlusIcon />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 173,
    marginEnd: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 98,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 16,
  },
  topView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginTop: 10,
    marginEnd: 30,
  },
  desc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: '#010101',
    marginTop: 4,
    opacity: 0.6,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  bottomItemContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomItemRight: {
    marginStart: 6,
  },
  txtAgreeNumber: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#010101',
  },
  txtAgreed: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: '#010101',
    opacity: 0.4,
  },
});

const PlayIcon = () => (
  <Svg width="40" height="40" fill="none" viewBox="0 0 40 40">
    <Rect width="40" height="40" fill="#FF6651" rx="20"></Rect>
    <Path
      fill="#fff"
      d="M24.36 18l-6.44-3.693a2.28 2.28 0 00-3.42 2v7.413a2.28 2.28 0 003.42 1.973L24.36 22a2.28 2.28 0 000-3.947V18zm-.666 2.793l-6.44 3.747a.96.96 0 01-.947 0 .947.947 0 01-.473-.82v-7.44a.946.946 0 011.42-.82l6.44 3.72a.947.947 0 010 1.64v-.027z"></Path>
  </Svg>
);

const UpIcon = () => (
  <Svg width="30" height="30" fill="none" viewBox="0 0 30 30">
    <Path
      fill="#000"
      fillOpacity="0.3"
      d="M20.25 16.5a.749.749 0 00-.915.54A5.25 5.25 0 0114.25 21h-4.192l.48-.473a.75.75 0 000-1.057 5.25 5.25 0 013.712-8.97.75.75 0 100-1.5A6.75 6.75 0 009 19.965l-1.282 1.253a.75.75 0 00-.158.817.75.75 0 00.69.465h6a6.75 6.75 0 006.54-5.063.751.751 0 00-.54-.937zm2.033-6.555l-2.25-2.25a.75.75 0 00-.248-.157.75.75 0 00-.57 0 .75.75 0 00-.247.157l-2.25 2.25a.753.753 0 001.065 1.065l.967-.953v4.193a.75.75 0 101.5 0v-4.193l.968.976a.75.75 0 001.229-.244.752.752 0 00-.164-.821v-.023z"></Path>
  </Svg>
);

const DownIcon = () => (
  <Svg width="31" height="30" fill="none" viewBox="0 0 31 30">
    <Path
      fill="#000"
      fillOpacity="0.3"
      d="M20.75 16.5a.75.75 0 00-.915.54A5.25 5.25 0 0114.75 21h-4.192l.48-.473a.75.75 0 000-1.057 5.25 5.25 0 013.712-8.97c.22-.011.44-.011.66 0a.756.756 0 00.18-1.5 6.24 6.24 0 00-.84 0A6.75 6.75 0 009.5 19.965l-1.282 1.253a.75.75 0 00-.158.817.75.75 0 00.69.465h6a6.75 6.75 0 006.54-5.063.752.752 0 00-.54-.937zm2.033-5.055a.75.75 0 00-1.065 0l-.968.998V8.25a.75.75 0 10-1.5 0v4.193l-.967-.976a.752.752 0 10-1.065 1.066l2.25 2.25a.75.75 0 00.247.157.705.705 0 00.57 0 .75.75 0 00.248-.157l2.25-2.25a.75.75 0 000-1.066v-.022z"></Path>
  </Svg>
);

const PlusIcon = () => (
  <Svg width="20" height="21" fill="none" viewBox="0 0 20 21">
    <Path
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 18.833a8.333 8.333 0 100-16.666 8.333 8.333 0 000 16.666zM10 7.167v6.666M6.667 10.5h6.666"></Path>
  </Svg>
);
