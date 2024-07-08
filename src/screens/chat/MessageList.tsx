import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {MessageListItem} from './MessageListItem';
import chatActions from 'redux/chats/actions';
import {useNavigation} from '@react-navigation/native';

const MessageList = ({fromChat = true, onSelectedChat = null}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = React.useMemo(() => (user ? user.id : null), [user]);
  const {
    allChats: {data: dataChats, searchedData: dataSearchedChats},
  } = useSelector((state: RootState) => state.chats);

  React.useEffect(() => {
    if (userId) {
      dispatch(chatActions.getAllChatsRequest({userId}));
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      {dataChats && dataSearchedChats.length > 0 ? (
        <FlatList
          keyExtractor={item => item.room}
          data={dataSearchedChats.filter(
            item => item.messages && item.messages.length > 0,
          )}
          renderItem={({item}) => {
            return (
              <MessageListItem
                chat={item}
                fromChat={fromChat}
                onSelected={chat => {
                  !fromChat && onSelectedChat && onSelectedChat(chat);
                }}
              />
            );
          }}
        />
      ) : (
        <View style={styles.empty}>
          <Image
            source={require('./../../assets/images/no_friends_icon.png')}
          />
          <Text style={styles.emptyText}>No friends yet.</Text>
        </View>
      )}
    </View>
  );
};

export default MessageList;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    position: 'relative',
  },
  container: {
    flex: 1,
    marginTop: 8,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 20,
  },
  chatBtn: {
    position: 'absolute',
    right: 35,
    bottom: 24,
  },
  friendListScroll: {
    marginTop: 28,
  },
  friendList: {},
});
