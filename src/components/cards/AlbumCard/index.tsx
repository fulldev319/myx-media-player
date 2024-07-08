import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import { styles } from './index.styles';

import albumSampleBg from 'assets/sample/album_bg_sample.png';

export const AlbumCard = () => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => { }}>
      <Image
        source={albumSampleBg} 
        style={styles.image}
        resizeMode='cover'
      />
      <Text style={styles.name}>Insomnia (Album)</Text>
    </TouchableOpacity>
  );
}