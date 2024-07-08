import React from 'react';
import {View, ActivityIndicator} from 'react-native';

export const CommonSkeleton = ({color = '#FFFFFF'}) => {
  return (
    <View style={{width: '100%', alignItems: 'center', marginTop: 30}}>
      <ActivityIndicator size="small" color={color} />
    </View>
  );
};
