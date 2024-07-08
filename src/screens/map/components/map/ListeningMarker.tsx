import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {hp, wp} from '../../global';
import {Colors, Fonts} from '../../res';
import {getDefaultAvatar} from 'helper/userHelpers';

const ListeningMarker = (props: any) => {
  const {data, onPress} = props;
  return (
    <TouchableOpacity style={Style.mainContainer} onPress={onPress}>
      <View style={Style.container}>
        <Image
          source={
            data.user.image === '' ? getDefaultAvatar() : {uri: data.user.image}
          }
          style={Style.userImage}
        />
        <View style={Style.contentCon}>
          <Text style={Style.listeningTo}>Listening to</Text>
          <Text style={Style.songName} numberOfLines={1}>
            {`${data.track.title} - ${data.track.artists[0]}`}
          </Text>
        </View>
      </View>
      <View style={[Style.triangle, Style.arrowDown]} />
    </TouchableOpacity>
  );
};

export default ListeningMarker;

const {width} = Dimensions.get('window');
const Style = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0,
    borderColor: 'red',
    borderRadius: 30,
  },
  container: {
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.color2,
  },
  userImage: {
    width: width * 0.08,
    height: width * 0.08 * 1,
    borderRadius: (width * 0.08 * 1) / 2,
  },
  contentCon: {
    marginLeft: wp(2),
    marginRight: wp(1),
  },
  listeningTo: {
    color: Colors.whiteRGBA60,
    fontFamily: Fonts.APPFONT_R,
    fontSize: wp(3),
  },
  songName: {
    color: Colors.white,
    fontFamily: Fonts.APPFONT_R,
    fontSize: wp(2.7),
    width: wp(35),
    marginTop: Platform.OS === 'android' ? wp(-1) : 0,
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
    borderTopColor: Colors.color2,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});
