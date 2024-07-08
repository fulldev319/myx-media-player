import {StackScreenProps} from '@react-navigation/stack';
import {RoundCloseIcon} from 'assets/svg';
import {getMatchingUsers} from 'helper/userHelpers';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SearchBar} from 'components/common/SearchBar';
import {RootState} from 'redux/interfaces';
import {useDispatch, useSelector} from 'react-redux';
import memoryAction from 'redux/memory/actions';
import CardTagFriend from './cards/CardTagFriend';
import {useRoute} from '@react-navigation/native';
import {apiSlambookAddFriend} from 'helper/slambookHelper';
import {BackIcon} from 'screens/TrackPlayList/components/TrackPlayListIcons';

const SlambookTagFriendsPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();
  const {params} = useRoute();

  const {tagFriends} = useSelector((state: RootState) => state.memory);
  const [searchText, setSearchText] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (searchText !== '') {
      getMatchingUsers(searchText.toLowerCase(), []).then(async resp => {
        if (resp?.success) {
          const filteredUsers = resp.data;
          setSearchedUsers(filteredUsers);
        }
      });
    }
  }, [searchText]);

  const onChangedText = val => {
    setSearchText(val);
  };

  const onAdd = data => {
    dispatch(memoryAction.addTagFriend(data));
  };

  const onRemove = data => {
    dispatch(memoryAction.removeTagFriend(data));
  };

  const onClose = () => {
    dispatch(memoryAction.clearTagFriend());
    navigation.pop();
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Add Members</Text>
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
          {searchedUsers.map((item, index) => {
            return <CardTagFriend data={item} slamBookId={params.slambook} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default SlambookTagFriendsPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    paddingHorizontal: 26,
  },
  header: {
    flexDirection: 'row',
    marginTop: 60,
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
