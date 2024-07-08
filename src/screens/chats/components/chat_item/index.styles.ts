import React from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 27,
    marginBottom: 21,
  },
  msgOwnerContainer: {
    marginLeft: 'auto',
    backgroundColor: '#9214F5',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopStartRadius: 45,
    borderBottomStartRadius: 45,
    borderBottomEndRadius: 30,
  },
  msgOwnerBody: {},
  msgOtherContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  msgOtherBodyContainer: {
    flex: 1,
  },
  msgOtherBody: {
    marginRight: 'auto',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopEndRadius: 45,
    borderBottomEndRadius: 45,
    borderTopStartRadius: 30,
  },
  msgTxt: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 12,
    color: 'white',
  },
  msgUserImage: {
    width: 30,
    height: 30,
    marginEnd: 13,
    borderRadius: 30,
  },
  photo: {
    width: 180,
    height: 180,
    borderRadius: 20,
  },
  audioWrapper: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  audioMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPlay: {
    marginRight: 12,
  },
  postWrapper: {
    width: 200,
    height: 220,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  postBody: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postKeyword: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 8,
  },
  postKeywordItem: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postKeywordTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 10,
    color: 'white',
  },
  postImage: {
    width: 22,
    height: 22,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  postNameTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 8,
    color: 'white',
    marginStart: 8,
  },
  postNameSubTxt: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
