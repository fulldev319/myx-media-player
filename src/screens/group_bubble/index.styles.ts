import React from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginTop: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnBack: {},
  titleTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 24,
    color: 'white',
  },
  timeTitleTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  panView: {
    width: 43,
    height: 4,
    backgroundColor: '#292929',
    borderRadius: 16,
    marginTop: 40,
  },
  panContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: '#292929',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 4,
  },
  posts: {
    marginTop: 20,
    paddingBottom: 50,
    paddingHorizontal: 16,
  },
  postContents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  personContainer: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  personItem: {
    width: 45,
    height: 45,
    borderRadius: 45,
    marginEnd: 4,
    overflow: 'hidden',
  },
  createBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});
