import React from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    width: '100%',
    marginTop: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 24,
    marginBottom: 24,
  },
  titleTxt: {
    flex: 1,
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
});
