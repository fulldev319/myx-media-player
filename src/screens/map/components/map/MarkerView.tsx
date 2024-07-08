// @ts-nocheck
import { View, Text } from 'react-native'
import React from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps';

const MarkerView = (props: any) => {

  const {
    coordinate = [0, 0],
    index = 0
  } = props

  return (
    <MapboxGL.MarkerView coordinate={coordinate}
      id={'id'}
      key={index}
    >
      {props.children}
    </MapboxGL.MarkerView>
  )
}

export default MarkerView