import {useNavigation} from '@react-navigation/native';
import {SearchBar} from 'components/common/SearchBar';
import {
  apiGetFollowers,
  apiGetFollowings,
  apiRemoveFollowPeople,
  apiUnFollowPeople,
  getDefaultAvatar,
} from 'helper/userHelpers';
import {ScrollView} from 'native-base';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import * as Progress from 'react-native-progress';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

export const FollowingPage = () => {
  const {goBack} = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const [selTab, setSelTab] = useState('Followers');
  // const [searchText, setSearchText] = useState('');

  const confirmUnFollowSheetRef = useRef<BottomSheetModal>(null);
  const snapPointsUnFollow = useMemo(() => [300, 300], []);
  const [isOpenedSheet, setIsOpenedSheet] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followersLastId, setFollowersLastId] = useState(undefined);
  const [followersHasMore, setFollowersHasMore] = useState(true);
  const [followersLoading, setFollowersLoading] = useState(false);

  const [followings, setFollowings] = useState([]);
  const [followingsLastId, setFollowingsLastId] = useState(undefined);
  const [followingsHasMore, setFollowingsHasMore] = useState(true);
  const [followingsLoading, setFollowingsLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    getFollow();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedSheet(false);
    } else {
      setIsOpenedSheet(true);
    }
    console.log('handleSheetChanges', index);
  }, []);

  const getFollow = () => {
    getFollowers();
    getFollowings();
  };

  const getFollowers = () => {
    if (!followersHasMore || followersLoading) {
      return;
    }
    setFollowersLoading(true);
    apiGetFollowers(user.id, followersLastId)
      .then(res => {
        if (res.success) {
          setFollowers(prev => [...prev, ...res.data]);
          setFollowersHasMore(res.hasMore);
          setFollowersLastId(res.lastId);
        } else {
          setFollowersHasMore(false);
        }
      })
      .finally(() => {
        setFollowersLoading(false);
      });
  };

  const getFollowings = () => {
    if (!followingsHasMore || followingsLoading) {
      return;
    }
    setFollowingsLoading(true);
    apiGetFollowings(user.id, followingsLastId)
      .then(res => {
        if (res.success) {
          setFollowings(prev => [...prev, ...res.data]);
          setFollowingsHasMore(res.hasMore);
          setFollowingsLastId(res.lastId);
        } else {
          setFollowingsHasMore(false);
        }
      })
      .finally(() => {
        setFollowingsLoading(false);
      });
  };

  // const onChangedText = val => {
  //   setSearchText(val);
  // };

  const followList = useMemo(() => {
    const ret = selTab === 'Followers' ? followers : followings;
    // .filter(
    //   follow => {
    //     if (searchText) {
    //       return (
    //         follow.username.includes(searchText) ||
    //         follow.handle.includes(searchText)
    //       );
    //     } else {
    //       return true;
    //     }
    //   },
    // );
    return ret;
  }, [selTab, followers, followings]);

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

  const onRemoveFollow = async userInfo => {
    setSelectedUser(userInfo);
    setIsOpenedSheet(true);
    confirmUnFollowSheetRef.current?.present();
  };

  const requestRemoveFollow = async () => {
    setShowLoading(true);
    confirmUnFollowSheetRef.current?.close();
    const res = await apiRemoveFollowPeople(selectedUser.id);

    if (res.success) {
      const newFollowers = followers.filter(
        (follower, index) => follower.id != selectedUser.id,
      );

      setFollowers(newFollowers);
    }

    setShowLoading(false);
  };

  const onUnfollowPeople = async people => {
    setShowLoading(true);
    const res = await apiUnFollowPeople(people.id);

    if (res.success) {
      const filteredArr = followings.filter(
        (item, index) => item.id !== people.id,
      );
      setFollowings(filteredArr);
    }
    setShowLoading(false);
  };

  const onBack = () => {
    confirmUnFollowSheetRef.current?.close();
    setTimeout(() => {
      goBack();
    }, 300);
  };

  const renderSureUnFollow = () => {
    return (
      <BottomSheetModal
        ref={confirmUnFollowSheetRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: '#1F1F1F',
          marginVertical: 0,
        }}
        snapPoints={snapPointsUnFollow}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {top: 10, left: 34, right: 34}]}>
          <Text style={styles.sureLogoutTitleTxt}>
            {selectedUser && `Confirm remove \n@${selectedUser.name}`}
          </Text>
          <TouchableOpacity
            style={styles.meOutContainer}
            onPress={requestRemoveFollow}>
            <Text style={styles.btnText}>
              Yes, remove {selectedUser && selectedUser.name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logOutCancelContainer}
            onPress={() => {
              confirmUnFollowSheetRef.current?.close();
            }}>
            <Text style={styles.btnText}>Nevermind</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            onBack();
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
        {followList.map(follow => (
          <View style={styles.followCard}>
            <View style={styles.userInfo}>
              <Image
                style={styles.userAvatar}
                resizeMode="cover"
                source={follow.image ? {uri: follow.image} : getDefaultAvatar()}
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
            <TouchableOpacity style={styles.action}>
              {selTab === 'Followers' ? (
                <Text
                  style={styles.actionTxt}
                  onPress={() => onRemoveFollow(follow)}>
                  Remove
                </Text>
              ) : (
                <Text
                  style={styles.actionTxt}
                  onPress={() => onUnfollowPeople(follow)}>
                  Unfollow
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
        {('Followers' ? followersLoading : followingsLoading) && (
          <View style={{paddingVertical: 20}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
      </ScrollView>
      {renderSureUnFollow()}
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
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FF6651',
  },
  tabTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  tabLabelSel: {
    marginLeft: 8,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FF6651',
  },
  tabLabel: {
    marginLeft: 8,
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    color: '#FFFFFF',
  },
  handle: {
    fontFamily: 'Poppins',
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
  actionTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
  },
  sureLogoutTitleTxt: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
  meOutContainer: {
    width: '100%',
    height: 53,
    borderRadius: 26.5,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  logOutCancelContainer: {
    width: '100%',
    height: 53,
    borderRadius: 26.5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 14,
  },
  btnText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
    marginStart: 16,
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
