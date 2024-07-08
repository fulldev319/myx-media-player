import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import Svg, {Path, Rect} from 'react-native-svg';
import {getDefaultAvatar} from 'helper/userHelpers';
import {MemeberGroup} from 'components/memberGroup';

import IMG_BG from 'assets/images/location_bg.png';
import IMG_FLAG from 'assets/images/location_flag.png';

export const CardLocation = ({}) => {
  return (
    <View style={styles.container}>
      <Image source={IMG_BG} style={styles.bgImage} resizeMode="cover" />
      <View style={styles.leftView}>
        <Image source={getDefaultAvatar()} style={styles.image} />
        <View style={styles.trendingContainer}>
          <Text style={styles.trendingText}>#1 Trending</Text>
        </View>
        <Text style={styles.title}>Rio Alexis in UruLand</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.awardedView}>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 4,
                backgroundColor: '#9214F5',
              }}
            />
            <Text style={styles.txtAwarded}>Awarded</Text>
          </View>
          <MemeberGroup isDummy={true} />
        </View>
        <Text style={styles.txtOthers}>Rio, Andra, Pam and 11 others</Text>
      </View>
      <View style={styles.rightView}>
        <Image source={IMG_FLAG} style={{width: 36, height: 68}} />
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <View style={{marginLeft: 35}}>
          <RedPlayIcon />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 319,
    height: 260,
    marginEnd: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  leftView: {
    flex: 1,
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 30,
    marginLeft: 4,
    marginVertical: 4,
    padding: 20,
  },
  rightView: {
    flex: 1,
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 70,
  },
  trendingContainer: {
    width: 60,
    height: 15,
    borderRadius: 15,
    paddingHorizontal: 5,
    backgroundColor: '#FF3F3F',
    justifyContent: 'center',
    marginTop: 13,
  },
  trendingText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 10,
  },
  awardedView: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(146, 20, 245, 0.1)',
    paddingHorizontal: 5,
  },
  txtAwarded: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: '#9214F5',
    marginStart: 4,
  },
  txtOthers: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '500',
    color: '#010101',
    opacity: 0.6,
  },
});

const RedPlayIcon = () => (
  <Svg width="52" height="52" fill="none" viewBox="0 0 52 52">
    <Rect width="46" height="46" x="3" y="3" fill="#FF6651" rx="23"></Rect>
    <Path
      fill="#fff"
      d="M30.36 24l-6.44-3.693a2.28 2.28 0 00-3.42 2v7.413a2.28 2.28 0 003.42 1.973L30.36 28a2.28 2.28 0 000-3.947V24zm-.666 2.793l-6.44 3.747a.96.96 0 01-.947 0 .947.947 0 01-.473-.82v-7.44a.946.946 0 011.42-.82l6.44 3.72a.948.948 0 010 1.64v-.027z"></Path>
    <Rect
      width="46"
      height="46"
      x="3"
      y="3"
      stroke="#fff"
      strokeWidth="6"
      rx="23"></Rect>
  </Svg>
);
