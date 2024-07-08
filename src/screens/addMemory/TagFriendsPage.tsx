import {StackScreenProps} from '@react-navigation/stack';
import {RoundCloseIcon} from 'assets/svg';
import {
  getMatchingUsers,
  apiGetRecentInteractedUsers,
} from 'helper/userHelpers';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SearchBar} from 'components/common/SearchBar';
import FriendCard from './FriendCard';
import {RootState} from 'redux/interfaces';
import {useDispatch, useSelector} from 'react-redux';
import memoryAction from 'redux/memory/actions';

const TagFriendsPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();
  const {tagFriends} = useSelector((state: RootState) => state.memory);

  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [searchedUsers, setSearchedUsers] = useState([]);

  useEffect(() => {
    getUserData();
  }, [searchText]);

  const getUserData = async () => {
    if (!hasMore || loading) {
      return;
    }

    try {
      setLoading(true);

      if (searchText !== '') {
        const res = await getMatchingUsers(
          searchText.toLowerCase(),
          [],
          lastId,
        );
        if (res?.success) {
          setSearchedUsers(res.data);
          setHasMore(res.hasMore);
          setLastId(res.lastId ? res.lastId[0] : null);
        }
      } else {
        const param = {
          offset: lastId,
        };
        const res = await apiGetRecentInteractedUsers(param);
        if (res?.success) {
          setSearchedUsers(res.data);
          setHasMore(res.hasMore);
          setLastId(res.lastId);
        }
      }
    } catch (error) {
      console.log('recent interacted users error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const onChangedText = val => {
    setSearchedUsers([]);
    setHasMore(true);
    setLastId(null);

    setSearchText(val);
  };

  const onAdd = data => {
    dispatch(memoryAction.addTagFriend(data));
  };

  const onRemove = data => {
    dispatch(memoryAction.removeTagFriend(data));
  };

  const onClose = () => {
    navigation.pop();
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <RoundCloseIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Tag Friends</Text>
      </View>
      <View style={styles.searchBar}>
        <SearchBar
          value={searchText}
          txtPlaceholder="Search by username here..."
          onChangedText={onChangedText}
        />
      </View>
      <ScrollView style={styles.body}>
        <Text style={styles.recentInteract}>Recent Interact</Text>
        <View style={styles.friendList}>
          {searchedUsers && searchedUsers.length > 0 ? (
            searchedUsers.map((item, index) => {
              return (
                <FriendCard
                  data={item}
                  isDeletable={false}
                  onAdd={data => {
                    onAdd(data);
                  }}
                  onRemove={data => {
                    onRemove(data);
                  }}
                  isSelected={tagFriends.some(friend => friend.id === item.id)}
                />
              );
            })
          ) : loading ? (
            <View style={{width: '100%', alignItems: 'center', marginTop: 32}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          ) : (
            <View style={{width: '100%', alignItems: 'center'}}>
              <Text style={{fontSize: 12, fontWeight: '500', color: '#fff'}}>
                No Data
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {tagFriends.length > 0 && (
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnSubmit}
            onPress={() => {
              onClose();
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0.9}}
              colors={['#ff3f3f', '#ff701f']}
              style={[StyleSheet.absoluteFill, styles.btnBgEffect]}>
              <Text style={styles.buttonText}>
                Add Friends ({tagFriends.length})
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TagFriendsPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    paddingHorizontal: 26,
  },
  header: {
    flexDirection: 'row',
    marginTop: 36,
  },
  title: {
    position: 'absolute',
    left: 50,
    right: 50,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  body: {
    flex: 1,
    marginTop: 40,
  },
  recentInteract: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
  },
  friendList: {
    marginTop: 20,
  },
  searchBar: {
    width: '100%',
    marginTop: 20,
  },
  btnContainer: {
    position: 'absolute',
    left: 26,
    bottom: 0,
    width: '100%',
    height: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSubmit: {
    width: '100%',
    height: 54,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 27,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  btnBgEffect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27,
    borderWidth: 0,
  },
});
