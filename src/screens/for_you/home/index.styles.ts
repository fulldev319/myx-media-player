import React from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 32,
  },
  body: {
    flex: 1,
    paddingTop: 30,
  },
});
