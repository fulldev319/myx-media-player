/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {SubPageHeader} from 'components/header/SubPageHeader';
import {ScrollView} from 'native-base';
import {ChatFriendCard} from 'components/cards/ChatFriendCard';
import {SearchBar} from 'components/common/SearchBar';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {apiGetMatchingUsers, apiSendFollowRequest} from 'helper/userHelpers';

export const ChatAddFriend = ({
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [searchText, setSearchText] = useState('');
  const [userList, setUserList] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMatchUserList('', true);
  }, []);

  useEffect(() => {
    getMatchUserList(searchText, true);
  }, [searchText]);

  const getMatchUserList = async (search, isNew = false) => {
    if (!isNew && (loading || !hasMore)) {
      return;
    }
    setLoading(true);

    apiGetMatchingUsers(search, lastId)
      .then(res => {
        if (res.success) {
          const data = res.data;
          setHasMore(res.hasMore);
          setLastId(res.lastId);
          const newUserList = data.filter(d => d.id !== user.id);
          if (isNew) {
            setUserList(newUserList);
          } else {
            setUserList(prev => [...prev, ...newUserList]);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangedText = val => {
    setSearchText(val);
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
      <SubPageHeader label="Add Friend to Chat" navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <SearchBar
            value={searchText}
            txtPlaceholder="Search name"
            onChangedText={onChangedText}
          />
        </View>
        {userList.length ? (
          <View style={styles.friendListContainer}>
            <ScrollView
              style={styles.friendListScroll}
              onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                  getMatchUserList(searchText);
                }
              }}
              scrollEventThrottle={500}>
              <View style={styles.friendList}>
                {userList.map((_otherUser, index) => (
                  <ChatFriendCard
                    otherUser={_otherUser}
                    key={index}
                    sendFollowRequest={() => {
                      apiSendFollowRequest(_otherUser.id).then(res => {
                        if (res.success && res.isFollowed) {
                          setUserList(prev =>
                            prev.map(_user => ({
                              ..._user,
                              isFollowing:
                                _user.id === _otherUser.id
                                  ? res.isFollowed
                                  : _user.isFollowing,
                            })),
                          );
                        }
                      });
                    }}
                  />
                ))}
              </View>
            </ScrollView>
            {loading && (
              <View
                style={{width: '100%', alignItems: 'center', marginTop: 32}}>
                <ActivityIndicator size="large" color="#777777" />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.empty}>
            <Image
              source={require('./../../assets/images/no_friends_icon.png')}
            />
            <Text style={styles.emptyText}>No friends Found.</Text>
          </View>
        )}
      </View>
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
});
