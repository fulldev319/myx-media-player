import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import defaultAvatar from './../../assets/images/default_avatar.png';
import {CheckSelectedIcon, CheckUnSelectedIcon} from 'assets/svg/chatIcons';

export const ChatCard = ({
  otherUser = null,
  selected = false,
  selectChat = () => {},
  style = {},
}) => {
  return (
    <TouchableOpacity
      onPress={selectChat}
      style={[styles.container, style, selected ? styles.selected : {}]}>
      <View style={styles.avatar}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={
            otherUser.profileImage
              ? {uri: otherUser.profileImage}
              : defaultAvatar
          }
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
          {otherUser.username}
        </Text>
        <Text style={styles.desc} numberOfLines={1} ellipsizeMode={'tail'}>
          {otherUser.handle}
        </Text>
      </View>
      {selected ? <CheckSelectedIcon /> : <CheckUnSelectedIcon />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 84,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
  },
  selected: {
    borderWidth: 1,
    borderColor: 'rgba(255, 102, 81, 0.4)',
    backgroundColor: 'rgba(255, 102, 81, 0.15)',
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
    borderRadius: 20,
  },
  info: {
    flex: 1,
    marginHorizontal: 20,
  },
  action: {
    width: 49,
    height: 31,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    // opacity: 0.6,
    marginTop: 2,
  },
  chat: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});
