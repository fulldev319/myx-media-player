import {useNavigation} from '@react-navigation/native';
import {ChatIcon} from 'assets/svg/bottomNavIcons';
import {SocialNavigator} from 'navigators/social';
import React, {useEffect, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {RootState} from 'redux/interfaces';
import {useDispatch, useSelector} from 'react-redux';
import chatActions from 'redux/chats/actions';
import SlamBookPage from './slam_book';

const SocialTabPage = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = useMemo(() => (user ? user.id : null), [user]);
  const {
    allChats: {data: dataChats},
  } = useSelector((state: RootState) => state.chats);

  useEffect(() => {
    if (userId) {
      dispatch(chatActions.getAllChatsRequest({userId}));
    }
  }, [userId]);

  const filteredChats = useMemo(
    () =>
      dataChats &&
      dataChats.data &&
      dataChats.data.filter(
        (chat, index) => chat.messages && chat.messages.length > 0,
      ),
    [dataChats?.data],
  );

  const onGoToChat = () => {
    navigation.navigate('MessageBox');
  };

  const onGoToGiphy = () => {
    // navigation.navigate('GiphyPage');
    navigation.navigate('CreateDebatPage');
  };

  const onGoSoundSticker = () => {
    navigation.navigate('SoundSticker');
  };

  const renderChatBadge = () => {
    return (
      <View style={styles.chatBadgeBody}>
        <Text style={styles.txtChatBadge}>{filteredChats.length}</Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Let’s Get Social</Text>
        <Text style={{color: 'white'}} onPress={onGoToGiphy}>
          Debate
        </Text>
        <Text style={{color: 'white'}} onPress={onGoSoundSticker}>
          SoSticker
        </Text>
        <TouchableOpacity onPress={onGoToChat}>
          <ChatIcon isActive={true} isWhite={true} />
          {filteredChats && filteredChats.length > 0 && renderChatBadge()}
        </TouchableOpacity>
      </View>
      {/* <SocialNavigator /> */}
      <SlamBookPage />
    </View>
  );
};

export default SocialTabPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  chatBadgeBody: {
    position: 'absolute',
    right: -3,
    top: -3,
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtChatBadge: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 6,
    fontWeight: '600',
    color: 'white',
  },
});
