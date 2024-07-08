import {MemeberGroup} from 'components/memberGroup';
import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export const CardOngoingLive = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mainBody}>
        <Text style={styles.title}>Rio Alexis</Text>
        <View style={{alignItems: 'center', marginTop: 6, marginStart: 6}}>
          <MemeberGroup isDummy={true} />
        </View>
        <Text style={styles.txtOther}>with 11 others</Text>
        <View style={styles.tuneInContainer}>
          <Text style={styles.txtTuneIn}>Tune In</Text>
          <HeadphoneIcon />
        </View>
      </View>
      <View style={styles.topImageView}>
        <Image source={getDefaultAvatar()} style={styles.topImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 124,
    height: 170,
    marginEnd: 10,
    alignItems: 'flex-start',
  },
  topImageView: {
    width: '100%',
    height: 56,
    alignItems: 'center',
  },
  topImage: {
    width: 44,
    height: 44,
    borderRadius: 44,
    borderColor: '#F4F4F4',
    borderWidth: 6,
  },
  mainBody: {
    position: 'absolute',
    top: 22,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  txtOther: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    opacity: 0.4,
    marginTop: 6,
  },
  tuneInContainer: {
    width: 80,
    height: 26,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: `rgba(0, 0, 0, 0.1)`,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  txtTuneIn: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: '#FF6651',
    marginEnd: 6,
  },
});

const HeadphoneIcon = () => (
  <Svg width="12" height="12" fill="none" viewBox="0 0 12 12">
    <Path
      fill="#FF6651"
      d="M6 1.5a5 5 0 00-5 5V10a.5.5 0 00.5.5H3A1.5 1.5 0 004.5 9V8A1.5 1.5 0 003 6.5H2a4 4 0 018 0H9A1.5 1.5 0 007.5 8v1A1.5 1.5 0 009 10.5h1.5a.5.5 0 00.5-.5V6.5a5 5 0 00-5-5zm-3 6a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H2v-2h1zm7 2H9a.5.5 0 01-.5-.5V8a.5.5 0 01.5-.5h1v2z"></Path>
  </Svg>
);
