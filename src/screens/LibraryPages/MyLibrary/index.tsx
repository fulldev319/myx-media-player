import {MyLibraryNavigator} from 'navigators/library';
import React, {useState, useRef, useEffect} from 'react';

import {View, Text} from 'react-native';
import {styles} from './index.styles';

export const MyLibraryPage = () => {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>My Library</Text>
      <View style={styles.tabContainer}>
        <MyLibraryNavigator />
      </View>
    </View>
  );
};
