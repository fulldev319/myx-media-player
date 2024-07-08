import React, {useState, createRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {Colors} from '../../res';
import CurrentLocationPopUp from './CurrentLocationPopUp';
import {Images} from '../../res';
import {hp, wp} from '../../global';

const CurrentLocationMarker = (props: any) => {
  var markerViewRef = createRef<any>();
  const {data} = props;

  const [markerXY, setMarkerXY] = useState({pagex: 0, pagey: 0});
  const [markerPopUpVisible, setMarkerPopUpVisible] = useState(false);
  const [markerPressData, setMarkerPressData] = useState('');

  const onMarkerPress = (data: any) => {
    if (markerViewRef) {
      //@ts-ignore
      markerViewRef.current.measure((x, y, width, height, pagex, pagey) => {
        setMarkerXY({pagex, pagey});
        data.ADDRESS = 'Current Location';
        setMarkerPressData(data);
        setMarkerPopUpVisible(true);
      });
    }
  };

  const onCloseMarkerPopUp = () => setMarkerPopUpVisible(false);

  return (
    <View style={Style.container} ref={markerViewRef}>
      <TouchableOpacity
        onPress={onMarkerPress.bind(null, data)}
        activeOpacity={1}>
        <Image
          source={Images.currentLocation}
          resizeMode="contain"
          style={Style.imageMarker}
        />
      </TouchableOpacity>
      {markerPopUpVisible && (
        <CurrentLocationPopUp
          markerXY={markerXY}
          data={markerPressData}
          onClose={onCloseMarkerPopUp}
        />
      )}
    </View>
  );
};

export default CurrentLocationMarker;

const {width} = Dimensions.get('window');
const Style = StyleSheet.create({
  container: {
    borderWidth: 0.1,
    borderColor: 'white',
    alignSelf: 'center',
  },
  markerOuter: {
    width: width * 0.09,
    height: width * 0.09 * 1,
    borderRadius: (width * 0.09 * 1) / 2,
    borderWidth: 5,
    borderColor: '#fff',
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  imageMarker: {
    height: hp(6),
    width: wp(14),
  },
});
