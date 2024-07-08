import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import React from 'react';
import {hp, wp} from '../../global';
import {Colors, Fonts, Images} from '../../res';
import {Animation} from '../../animations';
import {useTracks} from 'contexts/TrackContext';

const MapBottomBar = (props: any) => {
  const {
    visible = true,
    playerVisible = false,
    onShowFilter,
    onShowFriends,
    onShowNewRadio,
  } = props;

  const {showPlayer} = useTracks();
  return (
    visible && (
      <View
        style={{
          ...Style.container,
          paddingBottom: showPlayer ? wp(43) : wp(28),
        }}>
        <Animation duration={400}>
          <View
            style={{
              ...Style.innerContainer,
              justifyContent: playerVisible ? 'center' : 'space-between',
            }}>
            {Platform.OS === 'android' ? (
              <TouchableOpacity
                onPress={onShowFilter}
                style={playerVisible ? Style.filterBtnRound : Style.filterBtn}>
                <Image
                  source={Images.filter}
                  resizeMode="contain"
                  style={Style.filterIcon}
                />
                {!playerVisible && <Text style={Style.filterTxt}>Filters</Text>}
              </TouchableOpacity>
            ) : (
              <View style={[playerVisible ? Style.filterBtnRound : Style.filterBtn, {opacity: 0}]}></View>
            )}
            <TouchableOpacity style={Style.searchBtn} onPress={onShowNewRadio}>
              <Image
                source={Images.search}
                resizeMode="contain"
                style={Style.searchIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onShowFriends}
              style={playerVisible ? Style.filterBtnRound : Style.filterBtn}>
              <Image
                source={Images.users}
                resizeMode="contain"
                style={Style.filterIcon}
              />
              {!playerVisible && <Text style={Style.filterTxt}>Friends</Text>}
            </TouchableOpacity>
          </View>
        </Animation>
      </View>
    )
  );
};

export default MapBottomBar;

const {width} = Dimensions.get('window');
const Style = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: wp(100),
    paddingBottom: hp(5),
    paddingTop: hp(0.5),
    paddingHorizontal: 30,
    borderWidth: 0,
    borderColor: 'red',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    width: 100,
    backgroundColor: Colors.color4,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: Colors.color5,
  },
  filterIcon: {
    width: 16,
    height: 16,
  },
  filterTxt: {
    color: Colors.white,
    marginLeft: 8,
    fontSize: 12,
    fontFamily: Fonts.APPFONT_M,
    marginTop: Platform.OS === 'android' ? hp(0.5) : 0,
  },
  searchBtn: {
    width: width * 0.14,
    height: width * 0.14 * 1,
    borderRadius: (width * 0.14 * 1) / 2,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(3),
  },
  searchIcon: {
    width: wp(7),
    height: hp(5),
  },
  filterBtnRound: {
    width: width * 0.12,
    height: width * 0.12 * 1,
    borderRadius: (width * 0.12 * 1) / 2,
    backgroundColor: Colors.color4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
