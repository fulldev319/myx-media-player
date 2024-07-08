import React from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import {styles} from './index.styles';

import chartSampleBg from 'assets/sample/chart_bg_sample.png';

export const ChartCard = () => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => {}}>
      <View style={styles.imageContainer}>
        <Image source={chartSampleBg} style={styles.image} resizeMode="cover" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Viral 50</Text>
          <Text style={styles.tag}>Global</Text>
        </View>
      </View>
      <Text style={styles.description}>
        Your daily update of most played tracks
      </Text>
    </TouchableOpacity>
  );
};
