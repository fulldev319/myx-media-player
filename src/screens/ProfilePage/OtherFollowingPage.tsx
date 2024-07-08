import {useNavigation} from '@react-navigation/native';
import {SearchBar} from 'components/common/SearchBar';
import {
  apiFollowPeople,
  apiGetFollowers,
  apiGetFollowings,
  apiUnFollowPeople,
  getDefaultAvatar,
} from 'helper/userHelpers';
import {ScrollView} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Svg, {Path, Rect} from 'react-native-svg';

export const OtherFollowingPage = ({route, navigation}) => {
  const {goBack} = useNavigation();
  const {user} = route.params;
  const [selTab, setSelTab] = useState('Followers');
  const [searchText, setSearchText] = useState('');

  const [followers, setFollowers] = useState([]);
  const [followersLastId, setFollowersLastId] = useState(undefined);
  const [followersHasMore, setFollowersHasMore] = useState(true);
  const [followersLoading, setFollowersLoading] = useState(false);

  const [followings, setFollowings] = useState([]);
  const [followingsLastId, setFollowingsLastId] = useState(undefined);
  const [followingsHasMore, setFollowingsHasMore] = useState(true);
  const [followingsLoading, setFollowingsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [arrFollowed, setArrFollowed] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getFollowers();
    getFollowings();
  };

  const getFollowers = async () => {
    if (!followersHasMore || followersLoading) {
      return;
    }
    setFollowersLoading(true);

    const res = await apiGetFollowers(user.id, followersLastId);
    if (res.success) {
      setFollowers(prev => [...prev, ...res.data]);
      setFollowersHasMore(res.hasMore);
      setFollowersLastId(res.lastId);

      const followedUsers = res.data.filter(
        (item, index) => item.isFollowed === 'true',
      );

      setArrFollowed(prev => [...prev, ...followedUsers]);
    } else {
      setFollowersHasMore(false);
    }

    setFollowersLoading(false);
  };

  const getFollowings = async () => {
    if (!followingsHasMore || followingsLoading) {
      return;
    }
    setFollowingsLoading(true);

    const res = await apiGetFollowings(user.id, followingsLastId);
    if (res.success) {
      setFollowings(prev => [...prev, ...res.data]);
      setFollowingsHasMore(res.hasMore);
      setFollowingsLastId(res.lastId);
      const followedUsers = res.data.filter(
        (item, index) => item.isFollowed === 'true',
      );

      setArrFollowed(prev => [...prev, ...followedUsers]);
    } else {
      setFollowingsHasMore(false);
    }

    setFollowingsLoading(false);
  };

  const onFollowPeople = async people => {
    setShowLoading(true);
    const res = await apiFollowPeople(people.id);
    if (res.success) {
      setArrFollowed(prev => [...prev, ...[people]]);
    }
    setShowLoading(false);
  };

  const onUnfollowPeople = async people => {
    setShowLoading(true);
    const res = await apiUnFollowPeople(people.id);

    if (res.success) {
      const filteredArr = arrFollowed.filter(
        (item, index) => item.id !== people.id,
      );
      setArrFollowed(filteredArr);
    }
    setShowLoading(false);
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

  const handleScroll = e => {
    const loading =
      selTab === 'Followers' ? followersLoading : followingsLoading;
    if (!loading && isCloseToBottom(e.nativeEvent)) {
      if (selTab === 'Followers') {
        getFollowers();
      } else {
        getFollowings();
      }
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {user.handle}
        </Text>
        <View style={{width: 32}} />
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setSelTab('Followers')}
          style={selTab === 'Followers' ? styles.tabSel : styles.tab}>
          <Text
            style={selTab === 'Followers' ? styles.tabTxtSel : styles.tabTxt}>
            {followers.length}
          </Text>
          <Text
            style={
              selTab === 'Followers' ? styles.tabLabelSel : styles.tabLabel
            }>
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelTab('Followings')}
          style={selTab === 'Followings' ? styles.tabSel : styles.tab}>
          <Text
            style={selTab === 'Followings' ? styles.tabTxtSel : styles.tabTxt}>
            {followings.length}
          </Text>
          <Text
            style={
              selTab === 'Followings' ? styles.tabLabelSel : styles.tabLabel
            }>
            Followings
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        {/* <SearchBar
          value={searchText}
          txtPlaceholder="Search..."
          onChangedText={onChangedText}
        /> */}
      </View>
      <ScrollView style={styles.content} onScroll={handleScroll}>
        {selTab === 'Followers'
          ? followers.map((follow, index) => {
              const isFollowing = arrFollowed.filter(
                (followedItem, index) => follow.id === followedItem.id,
              );

              return (
                <View style={styles.followCard}>
                  <View style={styles.userInfo}>
                    <Image
                      style={styles.userAvatar}
                      resizeMode="cover"
                      source={
                        follow.image ? {uri: follow.image} : getDefaultAvatar()
                      }
                    />
                    <View style={styles.nameInfo}>
                      <Text
                        style={styles.username}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {follow.name}
                      </Text>
                      <Text
                        style={styles.handle}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {follow.handle}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={
                      isFollowing.length > 0 ? styles.action : styles.redAction
                    }>
                    {isFollowing.length > 0 ? (
                      <Text
                        style={styles.actionTxt}
                        onPress={() => onUnfollowPeople(follow)}>
                        Unfollow
                      </Text>
                    ) : (
                      <Text
                        style={styles.actionTxt}
                        onPress={() => onFollowPeople(follow)}>
                        Follow
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          : followings.map((follow, index) => {
              const isFollowing = arrFollowed.filter(
                (followedItem, index) => follow.id === followedItem.id,
              );

              return (
                <View style={styles.followCard}>
                  <View style={styles.userInfo}>
                    <Image
                      style={styles.userAvatar}
                      resizeMode="cover"
                      source={
                        follow.image ? {uri: follow.image} : getDefaultAvatar()
                      }
                    />
                    <View style={styles.nameInfo}>
                      <Text
                        style={styles.username}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {follow.name}
                      </Text>
                      <Text
                        style={styles.handle}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {follow.handle}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={
                      isFollowing.length > 0 ? styles.action : styles.redAction
                    }>
                    {isFollowing.length > 0 ? (
                      <Text
                        style={styles.actionTxt}
                        onPress={() => onUnfollowPeople(follow)}>
                        Unfollow
                      </Text>
                    ) : (
                      <Text
                        style={styles.actionTxt}
                        onPress={() => onFollowPeople(follow)}>
                        Follow
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
        {('Followers' ? followersLoading : followingsLoading) && (
          <View style={{paddingVertical: 20}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
      </ScrollView>
      {showLoading && (
        <View style={styles.loadingContainer}>
          <Progress.Circle
            size={80}
            indeterminate={true}
            borderWidth={5}
            color={'rgba(255, 102, 81, 1)'}
            thickness={20}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000000',
    flex: 1,
    paddingBottom: 120,
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 26,
    alignItems: 'center',
    height: 60,
  },
  name: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    color: '#FFFFFF',
    paddingHorizontal: 30,
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    height: 53,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSel: {
    flex: 1,
    height: 53,
    borderBottomWidth: 1,
    borderColor: '#FF6651',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTxtSel: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FF6651',
  },
  tabTxt: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  tabLabelSel: {
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FF6651',
  },
  tabLabel: {
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  searchBar: {
    paddingVertical: 20,
    paddingHorizontal: 26,
  },
  content: {
    flex: 1,
  },
  followCard: {
    marginBottom: 19,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 30,
  },
  nameInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  username: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    color: '#FFFFFF',
  },
  handle: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 8,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  action: {
    width: 110,
    height: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redAction: {
    width: 110,
    height: 32,
    borderWidth: 1,
    backgroundColor: '#FF6651',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTxt: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const BackIcon = props => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M7.29289 15.2929C6.90237 15.6834 6.90237 16.3166 7.29289 16.7071L13.6569 23.0711C14.0474 23.4616 14.6805 23.4616 15.0711 23.0711C15.4616 22.6805 15.4616 22.0474 15.0711 21.6569L9.41421 16L15.0711 10.3431C15.4616 9.95262 15.4616 9.31946 15.0711 8.92893C14.6805 8.53841 14.0474 8.53841 13.6569 8.92893L7.29289 15.2929ZM24 15H8V17H24V15Z"
      fill="white"
    />
    <Rect x={0.5} y={0.5} width={31} height={31} rx={15.5} stroke="#0E0E0E" />
  </Svg>
);
