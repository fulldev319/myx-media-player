import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';

import moment from 'moment';
import {socket} from 'screens/Auth';
import {ChatInput} from './components/chat_input';
import ChatItem, {ChatData, PostData} from './components/chat_item';

import {BackIcon} from './assets/BackIcon';
import {styles} from './index.styles';
import {
  generateComponentKey,
  getArrFromString,
  isCloseToBottom,
} from 'helper/utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiGetGroupChats} from 'helper/groupChatHelpers';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {apiGetCountryDetail} from 'helper/mapHelper';

export const ChatsScreen = () => {
  const chatInputRef = useRef(null);
  const messageListRef = useRef(null);

  const route = useRoute();
  const navigation = useNavigation();
  const bubbleId = route.params?.bubbleId ?? 7;

  const {user} = useSelector((state: RootState) => state.auth);
  const [isTyping, setIsTyping] = useState(false);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [arrMessage, setArrMessage] = useState([]);
  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [lastIdMessage, setLastIdMessage] = useState(null);

  useEffect(() => {
    loadMessages(true);
  }, []);

  useEffect(() => {
    if (socket) {
      const errorHandler = data => {
        console.log('--- error handler ---', data);
      };

      const newMessageHandler = data => {
        console.log('--- new message handler ---', data);
        addMessage(data);
      };

      socket.on('error-on-message-to-bubble', errorHandler);
      socket.on('new-bubble-comment', newMessageHandler);

      return () => {
        socket.removeListener('error-on-message-to-bubble', errorHandler);
        socket.removeListener('new-bubble-comment', newMessageHandler);
      };
    }
  }, [socket]);

  const loadMessages = async (isLoadingNew = false) => {
    if (isLoadingNew) {
      setLoadingMessages(true);

      const res = await apiGetGroupChats({
        bubble: bubbleId,
        limit: 15,
        offset: lastIdMessage,
      });

      if (res.success) {
        setHasMoreMessage(res.hasMore);
        setLastIdMessage(res.lastId);
        setArrMessage(res.data);
      }
      setLoadingMessages(false);
    } else {
      if (hasMoreMessage && !loadingMessages) {
        setLoadingMessages(true);

        const res = await apiGetGroupChats({
          bubble: bubbleId,
          limit: 15,
          offset: lastIdMessage,
        });

        if (res.success) {
          setHasMoreMessage(res.hasMore);
          setLastIdMessage(res.lastId);
          setArrMessage(prev => [...prev, ...res.data]);
        }
        setLoadingMessages(false);
      }
    }
  };

  const onBack = () => {
    navigation.goBack();
  };

  const goToCountry = async countryId => {
    const res = await apiGetCountryDetail(countryId);
    if (res.success) {
      navigation.navigate('NewWorldPage', {countryDetail: res.data});
    }
  };

  const goToOtherProfile = userId => {
    navigation.navigate('MyProfilePage', {fromOtherPage: true, id: userId});
  };

  const onInputFocus = () => {
    setIsTyping(true);
  };

  const onInputBlur = () => {
    setIsTyping(false);
  };

  const addMessage = msg => {
    if (msg) {
      setArrMessage(prev => [msg, ...prev]);
    }
    if (messageListRef.current) {
      messageListRef.current.scrollToIndex({index: 0});
    }
  };

  useEffect(() => {
    // if (socket && otherUser && chatRef.current.room) {
    //   socket.emit('typing-status', {
    //     from: userId,
    //     to: otherUser.userId,
    //     room: chatRef.current.room,
    //     isTyping: isTyping,
    //   });
    // }
  }, [isTyping, socket]);

  const handleScroll = e => {
    if (!loadingMessages && isCloseToBottom(e.nativeEvent)) {
      loadMessages(false);
    }
  };

  const messages = useMemo<ChatData[]>(() => {
    const convertedData = arrMessage.map((item, _) => {
      let createdDate = moment(item.timestamp).valueOf();

      let postData: PostData = {
        id: item.post_id,
        userId: item.post_user_id,
        userImage: item.post_user_image,
        userName: item.post_username,
        countryId: item.post_country,
        countryName: item.post_country_name,
        keyWords: getArrFromString(item.post_keywords, ','),
        medias: getArrFromString(item.post_media_urls, ','),
        mediaTypes: getArrFromString(item.post_media_types, ','),
      };
      let chatItem: ChatData = {
        fromOwner: item.creator === user.id,
        type: item.type,
        creatorName: item.name,
        creatorImage: item.image,
        mediaUrls: getArrFromString(item.media_urls),
        mediaTypes: getArrFromString(item.media_types),
        message: item.message,
        hasTags: item.hashtags,
        createdDate: createdDate,
        postData: postData,
      };

      return chatItem;
    });

    return convertedData;
  }, [arrMessage]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.titleTxt}>Chats</Text>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <FlatList
        inverted
        ref={messageListRef}
        keyExtractor={item => `chat-item-${generateComponentKey()}`}
        data={messages}
        renderItem={({item}) => (
          <ChatItem
            data={item}
            onGoToCountry={goToCountry}
            onGoToProfile={goToOtherProfile}
          />
        )}
        scrollEventThrottle={400}
        onScroll={handleScroll}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
        }}
      />
    );
  };

  const renderInput = () => {
    return (
      <View>
        <ChatInput
          userId={user.id}
          bubbleId={bubbleId}
          disabled={loadingMessages}
          chat={chatInputRef.current}
          socket={socket}
          addMessage={addMessage}
          loading={loadingMessages}
          onInputFocus={onInputFocus}
          onInputBlur={onInputBlur}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderBody()}
      {renderInput()}
    </View>
  );
};
