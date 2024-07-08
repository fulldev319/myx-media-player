import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import { styles } from './index.styles';

import songBgSample from 'assets/sample/song_bg_sample.png';

export const RecommendCard = () => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => { }}>
      <Image
        source={songBgSample} 
        style={styles.image}
        resizeMode='cover'
      />
      <Text style={styles.title}>Incomplete</Text>
      <Text style={styles.name}>Jay Sean</Text>
    </TouchableOpacity>
  );
}