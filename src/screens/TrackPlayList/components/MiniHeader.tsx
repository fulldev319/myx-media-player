import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BackIcon, BookMarkIcon} from './TrackPlayListIcons';

export const MiniHeader = ({info}) => {
  const {goBack} = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              goBack();
            }}>
            <BackIcon hasRect={true} />
          </TouchableOpacity>
          <Text style={styles.title}>{info.title}</Text>
          <TouchableOpacity onPress={() => {}} style={styles.actionBtn}>
            <BookMarkIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  container: {
    width: '100%',
    paddingHorizontal: 26,
  },
  header: {
    width: '100%',
    marginTop: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {},
  right: {},
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
