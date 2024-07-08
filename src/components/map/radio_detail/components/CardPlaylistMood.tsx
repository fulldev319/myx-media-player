import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

export const CardPlaylistMood = ({data}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.txtEmoji}>{data.emoji}</Text>
      <Text style={styles.txtName}>{data.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 124,
    height: 100,
    marginEnd: 12,
    borderRadius: 16,
    padding: 8,
    backgroundColor: 'rgba(255, 197, 59, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 42,
  },
  txtName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '500',
    color: '#010101',
    textAlign: 'center',
    marginTop: 8,
  },
  txtEmoji: {
    fontSize: 40,
  },
});
