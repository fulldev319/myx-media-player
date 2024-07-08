import React from 'react';
import {View, Text, StyleSheet, TextStyle, ViewStyle} from 'react-native';

interface CustomBadgeProps {
  label: string;
  labelStyle: TextStyle;
  containerStyle: ViewStyle;
  icon?: any;
  color?: string;
}

export const CustomBadge = (props: CustomBadgeProps) => {
  const {label, icon, labelStyle, containerStyle, color} = props;
  return (
    <View style={[styles.rowItem, {backgroundColor: color}, containerStyle]}>
      {icon}
      <Text style={labelStyle}>{label}</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
