/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import defaultAvatar from './../../assets/images/default_avatar.png';

export const ChatFriendHistoryCard = ({
  friend = null,
  style = {},
  onSelect = () => {},
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onSelect();
      }}
      style={[
        {backgroundColor: friend?.selected ? '#060606' : 'transparent'},
        styles.container,
        style,
      ]}>
      <View style={styles.avatar}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={friend?.image ? friend.image : defaultAvatar}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
          {friend?.name}
        </Text>
        <Text style={styles.desc}>Curabitur a purus 🎃</Text>
      </View>
      <View style={styles.action}>
        <Text style={styles.time}>19:01</Text>
        <View style={styles.countContainer}>
          {friend.selected && (
            <View style={styles.countBg}>
              <Text style={styles.count}>1</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    height: 84,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    marginHorizontal: 16,
  },
  action: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  name: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  desc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2,
  },
  time: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  countContainer: {
    width: 15,
    height: 15,
    marginTop: 5,
  },
  countBg: {
    width: 15,
    height: 15,
    backgroundColor: '#FF3F3F',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});
