/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import defaultAvatar from './../../assets/images/default_avatar.png';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import chatActions from 'redux/chats/actions';

export const RequestListItem = ({chat}) => {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  const {user} = useSelector((state: RootState) => state.auth);

  const [otherUser, setOtherUser] = useState<any>({});
  const [connected, setConnected] = useState<boolean>(false);

  const selectChat = React.useCallback(() => {
    chat.users.userFrom.userId = chat.users.userFrom.id;
    chat.users.userTo.userId = chat.users.userTo.id;

    dispatch(chatActions.setCurrentChat(chat));
    navigate('ChatRoom');
  }, [navigate]);

  useEffect(() => {
    if (chat) {
      if (
        chat.users &&
        chat.users.userFrom &&
        chat.users.userFrom.id === user.id
      ) {
        setOtherUser(chat.users.userTo);
      } else if (
        chat.users &&
        chat.users.userTo &&
        chat.users.userTo.id === user.id
      ) {
        setOtherUser(chat.users.userFrom);
      }
    }
  }, [chat]);

  return (
    <TouchableOpacity onPress={selectChat} style={[styles.container]}>
      <View style={styles.avatar}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={otherUser?.image ? {uri: otherUser.image} : defaultAvatar}
        />
      </View>
      <View style={styles.info}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
            {otherUser?.name}
          </Text>
          {/* {!connected && <NotConnectChatIcon />} */}
        </View>
        <Text style={styles.desc}>{chat.lastMessage}</Text>
      </View>
      <View style={styles.action}>
        <Text style={styles.time}>
          {chat.lastMessageDate ? moment(chat.lastMessageDate).fromNow() : ''}
        </Text>
        <View style={styles.countContainer}>
          {chat?.unreadMessagesCount > 0 && (
            <View style={styles.countBg}>
              <Text style={styles.count}>{chat?.unreadMessagesCount}</Text>
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
    borderRadius: 14,
    paddingVertical: 20,
  },
  avatar: {
    width: 40,
    height: 40,
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
    marginEnd: 6,
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
