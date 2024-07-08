import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

export const CountryItem = ({url, onClicked}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onClicked}>
      <Image source={{uri: url}} style={[StyleSheet.absoluteFill]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 24,
    marginEnd: 4,
    backgroundColor: '#7A5795',
    overflow: 'hidden',
  },
});
