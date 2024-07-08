import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SubPageHeader} from 'components/header/SubPageHeader';
import {ScrollView} from 'native-base';
import {SearchBar} from 'components/common/SearchBar';
import {RootState} from 'redux/interfaces';
import {useDispatch, useSelector} from 'react-redux';
import {apiGetSearchUsers} from 'helper/userHelpers';
import {useNavigation} from '@react-navigation/native';
import {ChatCard} from 'components/cards/ChatCard';
import {MessageIcon} from 'assets/svg/chatIcons';
import chatActions from 'redux/chats/actions';

export const AddChat = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const [searchText, setSearchText] = useState('');
  const [userList, setUserList] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [selUser, setSelUser] = useState();

  useEffect(() => {
    getSearchUsers(true);
  }, []);

  useEffect(() => {
    getSearchUsers(true);
  }, [searchText]);

  const getSearchUsers = async (isNew = false) => {
    if (!isNew && (loading || !hasMore)) {
      return;
    }

    if (isNew) {
      setSelUser(undefined);
    }
    setLoading(true);

    const response = await apiGetSearchUsers(
      searchText,
      isNew ? undefined : lastId,
    );
    if (response.success) {
      const data = response.data;
      setHasMore(response.hasMore);
      setLastId(response.lastId);
      const newUserList = data.filter(d => d.id !== user.id);
      if (isNew) {
        setUserList(newUserList);
      } else {
        setUserList(prev => [...prev, ...newUserList]);
      }
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  const onChangedText = val => {
    setSearchText(val);
  };

  const addChat = otherUser => {
    setSelUser(undefined);
    dispatch(
      chatActions.setCurrentChat({
        users: {
          userFrom: {userId: user.id},
          userTo: {userId: otherUser.id, following: otherUser.following},
        },
      }),
    );
    navigation.navigate('ChatRoom');
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <View style={styles.root}>
      <SubPageHeader label="Add New Chat" navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <SearchBar
            value={searchText}
            txtPlaceholder="Search by username here......"
            onChangedText={onChangedText}
          />
        </View>
        <Text style={styles.subTitle}>Quick Adds</Text>
        <View style={styles.friendListContainer}>
          <ScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                getSearchUsers();
              }
            }}
            scrollEventThrottle={500}
            style={styles.friendListScroll}>
            <View style={styles.friendList}>
              {userList.map(_otherUser => (
                <ChatCard
                  key={_otherUser.id}
                  otherUser={_otherUser}
                  selected={selUser && _otherUser.id === selUser.id}
                  selectChat={() => {
                    if (selUser && _otherUser.id === selUser.id) {
                      setSelUser(undefined);
                    } else {
                      setSelUser(_otherUser);
                    }
                  }}
                />
              ))}
            </View>
          </ScrollView>
          {loading && (
            <View style={{width: '100%', alignItems: 'center', marginTop: 32}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          )}
        </View>
      </View>
      {selUser && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              addChat(selUser);
            }}>
            <MessageIcon />
            <Text style={styles.actionTxt}>Start Chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  subTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 26,
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
  friendListContainer: {
    flex: 1,
  },
  description: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  friendListScroll: {
    marginTop: 10,
  },
  friendList: {},
  searchBar: {
    marginVertical: 23,
  },
  actionContainer: {
    paddingHorizontal: 26,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    borderRadius: 32,
    backgroundColor: '#FF6651',
    marginVertical: 12,
  },
  actionTxt: {
    marginLeft: 8,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
  },
});
