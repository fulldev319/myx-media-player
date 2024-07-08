import {RectPlusIcon} from 'assets/svg';
import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';

import {Item} from './Item';
import {styles} from './index.styles';

export const LibraryPlayListsPage = () => {
  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.actionContainer}>
        <RectPlusIcon />
        <Text style={styles.textCreatePlayList}>Create playlist</Text>
      </TouchableOpacity>
      <ScrollView>
        {Array(2).map((itemData, index) => (
          <Item key={index} data={itemData} />
        ))}
      </ScrollView>
    </View>
  );
};
