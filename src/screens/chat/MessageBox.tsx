import React, {useEffect, useMemo, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AddFriendIcon,
  NavigateIcon,
  RequestChatIcon,
} from 'assets/svg/chatIcons';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import MessageList from './MessageList';
import {FrequentChatCard} from 'components/cards/FrequentChatCard';
import {apiGetMostInteract} from 'helper/userHelpers';
import {BackIcon, PlusWithoutBorderIcon} from 'assets/svg';
import {SearchBar} from 'components/common/SearchBar';
import LinearGradient from 'react-native-linear-gradient';
import {apiGetChatRequests} from 'helper/chatHelpers';
import {useDispatch, useSelector} from 'react-redux';

import chatAction from 'redux/chats/actions';
import {RootState} from 'redux/interfaces';

export const MessageBox = ({navigation}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();
  const [requestCount, setRequestCount] = useState(0);
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    allChats: {data: dataChats},
  } = useSelector((state: RootState) => state.chats);

  useEffect(() => {
    apiGetChatRequests().then(res => {
      if (res.success) {
        setRequestCount(res.count);
      }
    });
  }, []);

  React.useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      if (user.id) {
        dispatch(chatAction.getAllChatsRequest({userId: user.id}));
      }
    });
    return focusHandler;
  }, [navigation, user]);

  React.useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      apiGetChatRequests().then(res => {
        if (res.success) {
          setRequestCount(res.count);
        }
      });
    });
    return focusHandler;
  }, [navigation]);

  const [arrFrequent, setArrFrequent] = useState([]);
  const [searchText, setSearchText] = useState('');

  const onChangedText = val => {
    setSearchText(val);
    if (dataChats && dataChats.data && dataChats.data.length > 0) {
      dispatch(
        chatAction.searchChat({searchText: val, chatList: dataChats.data}),
      );
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMostInteract();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadMostInteract();
  }, []);

  const loadMostInteract = async () => {
    const res = await apiGetMostInteract();

    if (res.success) {
      setArrFrequent(res.data);
    }
  };

  return (
    <View style={styles.root}>
      <Image
        source={require('./../../assets/images/trending_bg.png')}
        style={styles.backgroundImage}
        resizeMode={'stretch'}
      />
      <Image
        source={require('./../../assets/images/trending_light_bg.png')}
        style={styles.backgroundLight}
        resizeMode={'stretch'}
      />
      <View style={styles.chatAction}>
        <View style={styles.backAction}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.chatTxt}>Chat a Friend</Text>
        </View>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => {
            navigation.navigate('ChatAddFriend');
          }}>
          <AddFriendIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <SearchBar
            value={searchText}
            txtPlaceholder="Search by username here......"
            onChangedText={onChangedText}
          />
        </View>
        {arrFrequent.length > 0 && (
          <View style={styles.frequentContainer}>
            <Text style={styles.frequentTitle}>Frequently Interact</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {arrFrequent.map(item => (
                <FrequentChatCard data={item} style={{marginEnd: 8}} />
              ))}
            </ScrollView>
          </View>
        )}
        {requestCount > 0 && (
          <TouchableOpacity
            style={styles.requestChatContainer}
            onPress={() => navigation.navigate('ChatRequest')}>
            <RequestChatIcon />
            <Text style={styles.requestTitle}>Chat request</Text>
            <View style={styles.countBg}>
              <Text style={styles.count}>{requestCount}</Text>
            </View>
            <NavigateIcon />
          </TouchableOpacity>
        )}
        <View style={styles.recentContainer}>
          <MessageList />
        </View>
      </View>
      <TouchableOpacity
        style={styles.plusButtonContainer}
        onPress={() => navigation.navigate('AddChat')}>
        <LinearGradient
          colors={['#FF3F3F', '#FF701F']}
          useAngle={true}
          angle={120}
          style={styles.plusButton}>
          <PlusWithoutBorderIcon />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    position: 'relative',
    paddingTop: 60,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  chatAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginVertical: 16,
  },
  backAction: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 20,
    color: '#FFFFFF',
    marginHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  chatBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBtnTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#010101',
  },
  searchBar: {
    paddingHorizontal: 28,
    marginVertical: 10,
  },
  frequentContainer: {
    marginStart: 28,
  },
  frequentTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: 'white',
    marginTop: 14,
    marginBottom: 12,
  },
  requestChatContainer: {
    marginTop: 24,
    marginHorizontal: 28,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 8,
  },
  requestTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
    flex: 1,
    paddingHorizontal: 12,
  },
  countBg: {
    width: 15,
    height: 15,
    backgroundColor: '#FF3F3F',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  count: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  recentContainer: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 28,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestedTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: 'white',
  },
  requestedTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FF6651',
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
  friendListScroll: {
    marginTop: 28,
  },
  friendList: {},
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 450,
  },
  backgroundLight: {position: 'absolute', top: 0, right: 0, height: 450},
  plusButtonContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
