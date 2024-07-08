import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {hp, wp} from '../global';
import {Colors} from '../res';

interface LoaderProps {
  color?: string;
  bgColor?: string;
}

const Loader = (props: LoaderProps) => {
  const {color, bgColor} = props;
  return (
    <View
      style={[Style.container, {backgroundColor: bgColor || 'transparent'}]}>
      <ActivityIndicator color={color || Colors.black} size="small" />
    </View>
  );
};

export default Loader;

const Style = StyleSheet.create({
  container: {
    height: hp(100),
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
