/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  apiChatAccepRequest,
  apiChatRejectRequest,
  getChatMessages,
  setLastView,
  startChat,
} from 'helper/chatHelpers';
import {RootState} from 'redux/interfaces';
import {socket} from 'screens/Auth';
import {ChatInput} from 'screens/chat/ChatInput';
import ChatItem from './ChatItem';
import {ChatMsgTyping} from './ChatMsgTyping';
import {ChatPageHeader} from './ChatPageHeader';
import {useEffect, useMemo} from 'react';
import {UserCheckIcon} from 'assets/svg/chatIcons';
import {TrackRepeatMode, useTracks} from 'contexts/TrackContext';
const dayjs = require('dayjs');

export const ChatRoom = ({navigation}) => {
  const {goBack} = useNavigation();
  const {playTrackList, clearTracks} = useTracks();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = React.useMemo(() => (user ? user.id : null), [user]);
  const currentChat = useSelector(
    (state: RootState) => state.chats.currentChat,
  );
  const [loading, setLoading] = React.useState(true);
  const [showStart, setShowStart] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [lastIndex, setLastIndex] = React.useState(undefined);
  const [hasMore, setHasMore] = React.useState(true);
  const itemListRef = React.useRef(null);
  const chatRef = React.useRef(null);
  const [otherUser, setOtherUser] = React.useState<any>();
  const [isTyping, setIsTyping] = React.useState(false);
  const [isOtherTyping, setIsOtherTyping] = React.useState(false);
  const [isOtherConnected, setIsOtherConnected] = React.useState(false);

  useEffect(() => {
    if (userId && chatRef.current) {
      setLoading(false);
    }
  }, [userId, chatRef.current]);

  const isRequested = useMemo(() => {
    if (
      userId &&
      chatRef.current &&
      chatRef.current.userTo === userId &&
      chatRef.current.isRequest === 'requested'
    ) {
      return true;
    }
    return false;
  }, [userId, chatRef.current]);

  const isPending = useMemo(() => {
    if (
      otherUser &&
      otherUser.id === currentChat.users.userTo.userId &&
      currentChat.users.userTo.following !== undefined &&
      currentChat.users.userTo.following === 'false'
    ) {
      return true;
    }
    return false;
  }, [currentChat, otherUser]);

  const handleAcceptRequst = () => {
    apiChatAccepRequest(chatRef.current.room).then((res: any) => {
      if (res.success) {
        setShowStart(true);
        const sender = user.id === currentChat.users.userFrom.userId;
        createChat(
          sender
            ? currentChat.users.userTo.userId
            : currentChat.users.userFrom.userId,
        );
      }
    });
  };

  const handleRejectRequst = () => {
    apiChatRejectRequest(chatRef.current.room).then(res => {
      if (res.success) {
        handleBack();
      }
    });
  };

  const handleBack = () => {
    if (chatRef.current && chatRef.current.room) {
      socket.emit('leaveRoom', chatRef.current.room);
    }
    clearTracks();
    goBack();
  };

  const getMessages = (chatInfo = null, isNew = false) => {
    return new Promise((resolve, reject) => {
      if (!isNew && (loadingMessages || !hasMore)) {
        resolve(0);
        return;
      }
      setLoadingMessages(true);
      getChatMessages({
        room: chatInfo ? chatInfo.room : chatRef.current.room,
        lastIndex: isNew ? undefined : lastIndex,
      })
        .then((data: any) => {
          if (data.success) {
            const newMessages = data.data;
            newMessages.sort((msg1, msg2) => msg2.created - msg1.created);
            if (isNew) {
              setMessages(newMessages);
            } else {
              setMessages([...messages, ...newMessages]);
            }
            setHasMore(data.hasMore);
            setLastIndex(data.lastIndex);
            setTimeout(() => setLoadingMessages(false), 100);
            resolve(newMessages.length);
          }
        })
        .catch(error => {
          setLoadingMessages(false);
          reject(error);
        });
    });
  };

  const createChat = peerId => {
    let users = {
      userFrom: {
        userId: user.id,
      },
      userTo: {
        userId: peerId,
      },
    };

    startChat({
      users,
    })
      .then(async (data: any) => {
        if (data.success) {
          chatRef.current = data.data;
          if (chatRef.current?.users?.userTo.userId === userId) {
            setOtherUser(chatRef.current?.users?.userFrom);
          } else {
            setOtherUser(chatRef.current?.users?.userTo);
          }
          await getMessages(data.data, true);
          // update last view
          setLastView({
            room: chatRef.current.room,
            userId: userId,
            lastView: Date.now(),
          })
            .then((_data: any) => {
              if (_data.success) {
                socket.emit(
                  'numberMessages',
                  chatRef.current.users.userFrom.userId === user.id
                    ? chatRef.current.users.userFrom.userId
                    : chatRef.current.users.userTo.userId,
                );
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          Alert.alert('Error while creating a chat room');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    if (currentChat && currentChat.users) {
      setMessages([]);
      const sender = user.id === currentChat.users.userFrom.userId;
      createChat(
        sender
          ? currentChat.users.userTo.userId
          : currentChat.users.userFrom.userId,
      );
    }
  }, [currentChat]);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleScroll = e => {
    if (!loadingMessages && isCloseToBottom(e.nativeEvent)) {
      getMessages();
    }
  };

  const addMessage = msg => {
    if (msg) {
      setShowStart(false);
      setMessages(msgs => [msg, ...msgs]);
    }
    if (itemListRef.current) {
      itemListRef.current.scrollToIndex({index: 0});
    }
  };

  const proMessages = () => {
    return messages.map((msg, index) => ({
      ...msg,
      newDate:
        index === messages.length - 1
          ? false
          : !dayjs(messages[index].created).isSame(
              dayjs(messages[index + 1].created),
              'day',
            ),
      ignoreTimestamp:
        msg.from === user.id
          ? index === 0
            ? false
            : dayjs(msg.created).isSame(
                dayjs(messages[index - 1].created),
                'minutes',
              ) && msg.from === messages[index - 1].from
          : index === messages.length - 1
          ? false
          : dayjs(msg.created).isSame(
              dayjs(messages[index + 1].created),
              'minutes',
            ) && msg.from === messages[index + 1].from,
    }));
  };

  const onInputFocus = () => {
    setIsTyping(true);
  };

  const onInputBlur = () => {
    setIsTyping(false);
  };

  React.useEffect(() => {
    if (socket && otherUser?.userId && userId) {
      socket.emit('check user status', otherUser.userId);
    }
  }, [otherUser, userId, socket]);

  React.useEffect(() => {
    if (socket && otherUser && chatRef.current.room) {
      socket.emit('typing-status', {
        from: userId,
        to: otherUser.userId,
        room: chatRef.current.room,
        isTyping: isTyping,
      });
    }
  }, [isTyping, socket]);

  React.useEffect(() => {
    if (socket && otherUser) {
      const connectStatusHandler = connectStatus => {
        if (connectStatus.userId === otherUser?.userId) {
          setIsOtherConnected(connectStatus.connected);
        }
      };

      const typingStatusHandler = msg => {
        setIsOtherTyping(msg.isTyping);
        if (msg.isTyping) {
          setTimeout(() => {
            itemListRef.current?.scrollToIndex({index: 0});
          }, 1000);
        }
      };

      const messageReadHandler = message => {
        if (chatRef.current && chatRef.current.room) {
          if (message.room !== chatRef.current.room || message.noAddMessage) {
            return;
          }
          setMessages(msgs => [message, ...msgs]);
          if (itemListRef && itemListRef.current) {
            itemListRef.current.scrollToIndex({index: 0});
          }

          setLastView({
            room: chatRef.current.room,
            userId: userId,
            lastView: Date.now(),
          })
            .then((data: any) => {
              if (data.success) {
                socket.emit(
                  'numberMessages',
                  chatRef.current.users.userFrom.userId === user.id
                    ? chatRef.current.users.userFrom.userId
                    : chatRef.current.users.userTo.userId,
                );
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      };

      socket.on('user_connect_status', connectStatusHandler);
      socket.on('typing-status', typingStatusHandler);
      socket.on('message', messageReadHandler);
      return () => {
        socket.removeListener('user_connect_status', connectStatusHandler);
        socket.removeListener('typing-status', typingStatusHandler);
        socket.removeListener('message', messageReadHandler);
      };
    }
  }, [socket, otherUser, userId, chatRef.current]);

  return currentChat ? (
    <View style={styles.root}>
      <ChatPageHeader
        otherUser={otherUser}
        handleBack={handleBack}
        isOtherTyping={isOtherTyping}
        isOtherConnected={isOtherConnected}
      />
      <View style={styles.container}>
        {loadingMessages && (
          <View>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
        {messages.length > 0 && (
          <FlatList
            inverted
            keyExtractor={item => `chat-item-${item.created}-${item.from}`}
            data={proMessages()}
            renderItem={({item}) => (
              <ChatItem
                item={item}
                otherUser={otherUser}
                navigation={navigation}
              />
            )}
            ref={itemListRef}
            onScroll={handleScroll}
            scrollEventThrottle={400}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}
          />
        )}
        {!loadingMessages && messages.length === 0 && (
          <View style={styles.connect}>
            <Text style={styles.connectTxt}>
              Start to connect with each other 🎃
            </Text>
          </View>
        )}
        {isOtherTyping && <ChatMsgTyping otherUser={otherUser} />}
      </View>
      {isRequested ? (
        <View style={styles.requestContainer}>
          <Text style={styles.requestTxt}>
            You are receiving chat from someone that not on your friends list.
            You can accept chat to add to friends or delete chat.
          </Text>
          <View style={styles.requestActions}>
            <TouchableOpacity
              style={[styles.requestBtn, styles.requestAccept]}
              onPress={handleAcceptRequst}>
              <Text style={styles.requestBtnTxt}>Accept Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.requestBtn, styles.requestDelete]}
              onPress={handleRejectRequst}>
              <Text style={styles.requestBtnTxt}>Delete Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : showStart ? (
        <View style={styles.checkContainer}>
          <UserCheckIcon />
          <Text style={styles.checkTxt}>
            Added as friend. You can start chatting.
          </Text>
        </View>
      ) : (
        isPending && (
          <View style={styles.checkContainer}>
            <Text style={styles.checkTxt}>
              {otherUser?.name} haven’t add you as friends. Your chat will be
              pending until he(she) add you.
            </Text>
          </View>
        )
      )}
      <ChatInput
        disabled={isRequested || loading}
        chat={chatRef.current}
        socket={socket}
        addMessage={addMessage}
        loading={loadingMessages}
        onInputFocus={onInputFocus}
        onInputBlur={onInputBlur}
      />
    </View>
  ) : (
    <View />
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    position: 'relative',
    paddingTop: 30,
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    paddingHorizontal: 26,
  },
  connect: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  requestContainer: {
    paddingHorizontal: 28,
  },
  requestTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.4,
  },
  requestActions: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  requestBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 16,
  },
  requestAccept: {
    backgroundColor: '#FF6651',
    marginRight: 4,
  },
  requestDelete: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 4,
  },
  requestBtnTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  checkContainer: {
    paddingHorizontal: 28,
    marginVertical: 20,
    alignItems: 'center',
  },
  checkTxt: {
    marginTop: 8,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.4,
  },
});
