import {View, StyleSheet} from 'react-native';
import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {hp, wp} from '../../global';
import Config from 'react-native-config';

const MapView = (props: any) => {
  const {
    zoomEnabled = true,
    scrollEnabled = true,
    centerCoordinate = [0, 0],
    zoomLevel = 14,
    onRegionDidChange = null,
  } = props;

  return (
    <View style={Style.container}>
      <MapboxGL.MapView
        rotateEnabled={false}
        style={Style.container}
        zoomEnabled={zoomEnabled}
        scrollEnabled={scrollEnabled}
        ref={ref => {
          //@ts-ignore
          global.mapRef = ref;
        }}
        styleURL={Config.MAPBOX_STYLE_URL}
        onRegionDidChange={onRegionDidChange}>
        <MapboxGL.Camera
          centerCoordinate={centerCoordinate}
          zoomLevel={zoomLevel}
          animationMode="flyTo"
          animationDuration={250}
        />

        {props.children}
      </MapboxGL.MapView>
    </View>
  );
};

export default MapView;

const Style = StyleSheet.create({
  container: {
    height: hp(100),
    width: wp(100),
  },
});
