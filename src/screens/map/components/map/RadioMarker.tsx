import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Images} from '../../res';
import {hp, wp} from '../../global';

const RadioMarker = (props: any) => {
  const {data, type, onPress} = props;

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(data)}
      style={[Style.mainContainer, type === 'featured' && {}]}>
      <View
        style={[
          Style.container,
          ,
          type === 'featured' && {
            backgroundColor: '#rgba(47, 155, 255, 0.2)',
            borderColor: '#2F9BFF',
          },
        ]}>
        <View
          style={[
            Style.innerCirlce,
            type === 'featured' && {
              backgroundColor: '#rgba(47, 155, 255, 0.2)',
              borderColor: '#2F9BFF',
            },
          ]}
        />
        <View style={Style.innerBox}>
          <View
            style={[
              Style.innerBoxContent,
              type === 'featured' && {
                backgroundColor: '#2F9BFF',
              },
            ]}>
            <View style={Style.userImageCon}>
              {type !== 'featured' &&
                data.images &&
                data.images.map((item, index) => (
                  <Image source={{uri: item}} style={Style.userImage} />
                ))}
            </View>
            <Text style={Style.name} numberOfLines={1}>
              {data.title}
            </Text>
            <View style={Style.headPhoneCon}>
              {type === 'normal' && (
                <Image
                  source={Images.headPhones}
                  resizeMode="contain"
                  style={Style.headPhoneIcon}
                />
              )}
              <Text style={Style.numberOfLis}>
                {type === 'normal'
                  ? data.trackNumber
                  : `${data.city} (${data.country})`}
              </Text>
            </View>
            <Image source={Images.listening} style={Style.listeningImage} />
          </View>
          <View
            style={[
              Style.triangle,
              Style.arrowDown,
              type === 'featured' && {borderTopColor: '#2F9BFF'},
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RadioMarker;

const {width} = Dimensions.get('window');
const Style = StyleSheet.create({
  mainContainer: {
    paddingTop: wp(6),
    alignSelf: 'center',
    borderWidth: 0,
    borderColor: 'red',
  },
  container: {
    width: width * 0.3,
    height: width * 0.3 * 1,
    borderRadius: (width * 0.3 * 1) / 2,
    backgroundColor: Colors.themeRGBA20,
    borderWidth: 1,
    borderColor: Colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCirlce: {
    width: width * 0.08,
    height: width * 0.08 * 1,
    borderRadius: (width * 0.08 * 1) / 2,
    backgroundColor: Colors.themeRGBA20,
    borderWidth: 1,
    borderColor: Colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerBox: {
    width: wp(27),
    height: wp(23),
    position: 'absolute',
    top: wp(-6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerBoxContent: {
    borderRadius: 8,
    width: wp(27),
    height: wp(20),
    backgroundColor: Colors.theme,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  arrowDown: {
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderLeftWidth: 8,
    borderTopColor: Colors.theme,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  userImageCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
    marginTop: wp(1),
  },
  userImage: {
    width: width * 0.04,
    height: width * 0.04 * 1,
    borderRadius: (width * 0.04 * 1) / 2,
    marginLeft: wp(-2),
  },
  name: {
    color: Colors.white,
    fontFamily: Fonts.APPFONT_SB,
    textAlign: 'center',
    fontSize: wp(2.7),
    marginTop: wp(0.5),
    marginHorizontal: 2,
  },
  headPhoneCon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headPhoneIcon: {
    width: wp(4),
    height: hp(3),
    marginTop: wp(-1),
  },
  numberOfLis: {
    color: Colors.white,
    fontSize: wp(2.8),
    fontFamily: Fonts.APPFONT_R,
    marginTop: hp(0.2),
    marginLeft: wp(1),
  },
  listeningImage: {
    width: wp(27),
    height: wp(4.6),
    position: 'absolute',
    bottom: 0,
    borderRadius: 8,
    alignSelf: 'center',
  },
});
