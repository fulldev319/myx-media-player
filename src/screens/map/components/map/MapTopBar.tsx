import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import {hp, wp} from '../../global';
import {Colors, Fonts, Images} from '../../res';
import {Animation} from '../../animations';

const MapTopBar = (props: any) => {
  const [activeBtn, setActiveBtn] = useState(1);
  const {visible = true} = props;

  const onBtnPress = (index: any) => setActiveBtn(index);
  return (
    <View style={Style.container}>
      <Animation duration={400}>
        <View style={Style.innerContainer}>
          <TouchableOpacity
            style={{
              ...Style.activeBtn,
              backgroundColor: activeBtn === 0 ? Colors.color7 : Colors.color6,
            }}
            activeOpacity={0.6}
            onPress={onBtnPress.bind(null, 0)}>
            <Image
              source={activeBtn === 0 ? Images.radioWhite : Images.radioGrey}
              resizeMode="contain"
              style={Style.radioBtn}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...Style.activeBtn,
              backgroundColor: activeBtn === 1 ? Colors.color7 : Colors.color6,
            }}
            activeOpacity={0.6}
            onPress={onBtnPress.bind(null, 1)}>
            <Image
              source={
                activeBtn === 1 ? Images.headPhonesWhite : Images.headPhonesGrey
              }
              resizeMode="contain"
              style={Style.headPhones}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...Style.activeBtn,
              backgroundColor: activeBtn === 2 ? Colors.color7 : Colors.color6,
            }}
            activeOpacity={0.6}
            onPress={onBtnPress.bind(null, 2)}>
            <Image
              source={
                activeBtn === 2 ? Images.playCircleWhite : Images.playCircleGrey
              }
              resizeMode="contain"
              style={Style.playCircle}
            />
          </TouchableOpacity>
        </View>
      </Animation>
    </View>
  );
};

export default MapTopBar;

const Style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: wp(100),
    paddingTop: hp(4),
    paddingBottom: hp(0.5),
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'red',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Colors.color6,
    width: wp(80),
    borderRadius: 16,
    paddingVertical: wp(2),
    paddingHorizontal: wp(1),
    height: wp(13),
  },
  activeBtn: {
    width: wp(25),
    height: wp(10),
    backgroundColor: Colors.color7,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioBtn: {
    height: wp(7),
    width: wp(8),
  },
  headPhones: {
    height: wp(6),
    width: wp(7),
  },
  playCircle: {
    height: wp(6.5),
    width: wp(7.5),
  },
});
