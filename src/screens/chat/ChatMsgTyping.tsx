import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import defaultAvatar from './../../assets/images/default_avatar.png';
import typingGif from './../../assets/images/typing.gif';

export const ChatMsgTyping = ({otherUser = null, style = {}}) => {
  return (
    <View style={[styles.container]}>
      <View style={[styles.msgContainer]}>
        <View>
          <Text style={styles.account}>{otherUser?.name}</Text>
        </View>
        <View style={styles.typingMsg}>
          <Image source={typingGif} style={{height: 13}} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 26,
    marginVertical: 8,
  },
  msgContainer: {
    marginRight: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#FF6651',
    padding: 16,
  },
  account: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 15,
    display: 'flex',
    alignItems: 'center',
    color: '#FF6651',
    marginBottom: 8,
  },
  typingMsg: {
    minWidth: 50,
    opacity: 0.6,
    marginLeft: -4,
  },
});
