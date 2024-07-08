import React, {useEffect, useState} from 'react';

import {Image, TouchableOpacity, Text, View} from 'react-native';
import {styles} from './index.styles';

export const Item = ({data}: ItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image
          source={{uri: data.ImageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <TouchableOpacity style={styles.content}>
        <Text
          style={{...styles.title}}
          numberOfLines={1}
          ellipsizeMode="tail"></Text>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail"></Text>
      </TouchableOpacity>
    </View>
  );
};

type ItemProps = {
  data: any;
};
