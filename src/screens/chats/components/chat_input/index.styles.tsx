import React from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    paddingTop: 9,
    paddingHorizontal: 26,
    paddingBottom: 26,
  },
  conatiner: {
    padding: 9,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 84,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  inputText: {
    fontFamily: 'Poppins',
    flex: 1,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    paddingLeft: 10,
    paddingRight: 18,
  },
  emojiInput: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
  },
  recordControl: {
    paddingTop: 26,
    paddingHorizontal: 26,
    alignItems: 'center',
  },
  control: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  controlBtn: {
    width: 67,
    height: 67,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duration: {
    marginTop: 10,
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6651',
    marginBottom: 30,
  },
  durationTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
  },
});
