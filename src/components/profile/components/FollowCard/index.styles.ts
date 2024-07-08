import React from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 8,
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    marginStart: 8,
  },
  userName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  followInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followUsersTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.4)',
    marginStart: 8,
    marginTop: 2,
  },
  postContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  postCountTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#D96692',
  },
  postWeekTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.3)',
  },
  joinedView: {
    flex: 1,
  },
  joinedTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  countryView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  countryItem: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7A5795',
    marginEnd: 4,
  },
  btnContainer: {
    width: 80,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 13,
  },
  followingTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
});
