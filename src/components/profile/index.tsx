import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {ThreeDotsIcon} from 'native-base';

import {styles} from './index.styles';
import {ArrowLeftIcon} from 'assets/svg';
import {
  apiGetMyAudios,
  apiGetUserInfo,
  getDefaultAvatar,
} from 'helper/userHelpers';
import {
  apiGetFictionMyEmoji,
  apiGetMyPostingCountries,
} from 'helper/fictionHelper';
import {
  ActivityIcon,
  EmolikeIcon,
  PostIcon,
  PrivateAccountIcon,
  UserFollowingIcon,
  UserGroupIcon,
} from './assets/svgs';
import {PostCountry} from './components';
import {CustomBadge} from 'screens/thread/components/CustomBadge';
import WheelView from 'components/AudioWheels/WheelView';
import {RootState} from 'redux/interfaces';
import Emolike from 'components/common/Emolike';
import {apiGetEmoLikes} from 'helper/emoLikesHelper';
import {isCloseToBottom, SCREEN_WIDTH} from 'helper/utils';
import {ExpandEmolike} from 'components/common/ExpandEmolike';
import {FollowerSheet} from './components/Followers';
import {FollowingSheet} from './components/Following';

const paddings = [0, 50, 0];

const ProfilePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fromOther = route.params?.fromOtherPage;
  const userId = route.params?.id;
  const {auth} = useSelector((state: RootState) => state);

  const [hasMoreDebates, setHasMoreDebates] = useState(true);
  const [loadingDebates, setLoadingDebates] = useState(false);
  const [debatesLastId, setDebatesLastId] = useState(0);
  const [fictionDebateList, setFictionDebateList] = useState([]);

  const [emolikesHasMore, setEmolikesHasMore] = useState(false);
  const [emolikesTotalCount, setEmolikesTotalCount] = useState(0);
  const [emolikes, setEmolikes] = useState([]);

  const [countries, setCountries] = useState([]);
  const [postingCountries, setPostingCountries] = useState([]);

  const [activityTab, setActivityTab] = useState('Posts');

  const [postsCount, setPostCount] = useState(0);
  const [debatesCount, setDebatesCount] = useState(0);
  const [tabEmolikesCount, setTabEmolikesCount] = useState(0);

  const [showFollowSheet, setShowFollowSheet] = useState(false);
  const [showFollowerSheet, setShowFollowerSheet] = useState(false);

  const [userInfo, setUserInfo] = useState({
    id: null,
    image: null,
    username: null,
    handle: null,
    is_private: null,
    followers: null,
    followings: null,
  });

  useEffect(() => {
    loadUserInfo();
  }, []);

  useEffect(() => {
    loadMyEmolikes();
    loadPostingCountries();
  }, []);

  useEffect(() => {
    loadInitData();
    loadFictionDebates(false);
  }, [activityTab]);

  const loadUserInfo = async () => {
    if (!userId) {
      setUserInfo(auth.user);
      setCountries(auth.countries);
    } else {
      const res = await apiGetUserInfo(userId);
      if (res.success) {
        setCountries(res.data?.countries);
        setUserInfo(res.data);
      }
    }
  };

  const loadInitData = async () => {
    if (userId && userInfo.is_private) return;
    setLoadingDebates(true);
    const initData = await Promise.all([
      apiGetMyAudios(10, 0, 'audio', userId),
      apiGetMyAudios(10, 0, 'debate', userId),
      apiGetEmoLikes(10, 0, userId),
    ]);
    setPostCount(initData[0].data.length);
    setDebatesCount(initData[1].data.length);
    setTabEmolikesCount(initData[2].data.length);
    setLoadingDebates(false);
  };

  const loadFictionDebates = async hasMoreLoading => {
    if (userId && userInfo.is_private) return;
    if (!hasMoreDebates || loadingDebates) {
      return;
    }

    try {
      if (!hasMoreLoading) setLoadingDebates(true);
      let res;
      if (activityTab === 'Posts') {
        res = await apiGetMyAudios(10, debatesLastId, 'audio', userId);
      }
      if (activityTab === 'Debate') {
        res = await apiGetMyAudios(10, debatesLastId, 'debate', userId);
      }
      if (activityTab === 'Emolikes') {
        res = await apiGetEmoLikes(10, debatesLastId, userId);
      }
      if (res.success) {
        setHasMoreDebates(res.hasMore);
        setDebatesLastId(res.lastId);
        setFictionDebateList(prev => [...prev, ...res.data]);
      } else {
        setHasMoreDebates(false);
      }
    } catch (error) {
      console.log('fiction debates error: ', error);
    } finally {
      setLoadingDebates(false);
    }
  };

  const loadMyEmolikes = async () => {
    if (userId && userInfo.is_private) return;
    const params = {
      offset: 0,
      limit: 10,
      userId,
    };
    const res = await apiGetFictionMyEmoji(params);
    if (res.success) {
      setEmolikes(prev => [...prev, ...res.data]);
      setEmolikesHasMore(res.hasMore);
      setEmolikesTotalCount(res.total);
    }
  };

  const loadPostingCountries = async () => {
    if (userId && userInfo.is_private) return;
    let hasMore = false;
    let lastId = 0;
    do {
      const params = {offset: lastId, limit: 10, userId};
      const res = await apiGetMyPostingCountries(params);

      if (res.success) {
        setPostingCountries(prev => [...prev, ...res.data]);
        hasMore = res.hasMore;
        lastId = res.lastId;
      }
    } while (hasMore);
  };

  const renderHeader = () => {
    return (
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={{marginEnd: 40}}
          onPress={() => {
            navigation.goBack();
          }}>
          {fromOther ? <ArrowLeftIcon /> : <View />}
        </TouchableOpacity>
        <Text style={styles.title}>{`@${userInfo.handle}`}</Text>
        <TouchableOpacity onPress={() => {}}>
          <ThreeDotsIcon color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  const renderUserInfo = () => {
    return (
      <View>
        <Image
          source={require('./assets/images/bg_profile.png')}
          style={styles.userBackground}
        />
        <View style={styles.avatarWrap}>
          <Image
            style={styles.userImage}
            resizeMode="cover"
            source={userInfo.image ? {uri: userInfo.image} : getDefaultAvatar()}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userInfo.username}</Text>
          <View style={styles.userStatus}>
            {countries?.map(country => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('NewWorldPage', {
                      countryDetail: country,
                    })
                  }
                  key={country.country}
                  style={styles.rowItem}>
                  <View style={styles.countryWrap}>
                    <Image
                      source={{uri: country.image}}
                      style={{width: '100%', height: '100%'}}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.userStatusTxt,
                      {maxWidth: SCREEN_WIDTH / countries.length - 50},
                    ]}>
                    {country.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.userFollowing}>
            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => {
                setShowFollowSheet(true);
              }}>
              <UserGroupIcon />
              <Text style={styles.followersTxt}>
                {userInfo.followers} followers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rowItem, {marginLeft: 14}]}
              onPress={() => {
                setShowFollowerSheet(true);
              }}>
              <UserFollowingIcon />
              <Text style={styles.followersTxt}>
                {userInfo.followings} followings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View></View>
      </View>
    );
  };

  const renderEmolikes = () => {
    if (userId && userInfo.is_private) return;
    if (!emolikesTotalCount) return;
    return (
      <View style={styles.contentWrap}>
        <View style={styles.contentHeader}>
          <View style={styles.rowItem}>
            <EmolikeIcon />
            <Text style={styles.contentHeaderTxt}>
              {`Emolikes Received (${emolikesTotalCount})`}
            </Text>
          </View>
          {emolikesHasMore ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EmolikePage', {id: userInfo.id})
              }>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <ScrollView horizontal style={{marginTop: 10}}>
          {emolikes.map((emolike, index) => {
            return (
              <Emolike
                key={index}
                url={emolike.url}
                large={true}
                containerStyle={{marginRight: 8}}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderPosting = () => {
    if (userId && userInfo.is_private) return;
    return (
      <View style={styles.contentWrap}>
        <View style={styles.contentHeader}>
          <View style={styles.rowItem}>
            <PostIcon />
            <Text style={styles.contentHeaderTxt}>Posting Countries</Text>
          </View>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followAll}>Follow All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <ScrollView horizontal>
            {postingCountries.map(postCountry => {
              return (
                <PostCountry
                  onPress={country =>
                    navigation.navigate('NewWorldPage', {
                      countryDetail: country,
                    })
                  }
                  key={postCountry.country}
                  data={postCountry}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  const onChangeTab = tab => {
    setActivityTab(tab);
    setDebatesLastId(0);
    setHasMoreDebates(true);
    setFictionDebateList([]);
  };

  const renderActivities = () => {
    if (userId && userInfo.is_private) return;
    return (
      <View style={styles.contentWrap}>
        <View style={styles.contentHeader}>
          <View style={styles.rowItem}>
            <ActivityIcon />
            <Text style={styles.contentHeaderTxt}>Activities</Text>
          </View>
        </View>
        <View style={styles.content}>
          {postsCount ? (
            <TouchableOpacity onPress={() => onChangeTab('Posts')}>
              <CustomBadge
                label="Posts"
                labelStyle={styles.badgeTxt}
                containerStyle={[
                  styles.badge,
                  activityTab !== 'Posts' && {backgroundColor: 'transparent'},
                ]}
              />
            </TouchableOpacity>
          ) : null}
          {debatesCount ? (
            <TouchableOpacity onPress={() => onChangeTab('Debate')}>
              <CustomBadge
                label="Debate"
                labelStyle={styles.badgeTxt}
                containerStyle={[
                  styles.badge,
                  activityTab !== 'Debate' && {backgroundColor: 'transparent'},
                ]}
              />
            </TouchableOpacity>
          ) : null}
          {tabEmolikesCount ? (
            <TouchableOpacity onPress={() => onChangeTab('Emolikes')}>
              <CustomBadge
                label="Emolikes"
                labelStyle={styles.badgeTxt}
                containerStyle={[
                  styles.badge,
                  activityTab !== 'Emolikes' && {
                    backgroundColor: 'transparent',
                  },
                ]}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.aroundWorldMainContainer}>
          {loadingDebates ? (
            <View style={{marginTop: 16}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          ) : fictionDebateList && fictionDebateList.length > 0 ? (
            fictionDebateList.map((item, index) =>
              activityTab !== 'Emolikes' ? (
                <View
                  style={[
                    styles.countryWheel,
                    {
                      paddingTop: paddings[index % 3],
                      flexWrap: 'wrap',
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      if (activityTab === 'Debate') {
                        navigation.navigate('ThreadPage', {id: item.id});
                      }
                    }}>
                    <WheelView
                      data={{
                        inner_image: item.image,
                        middle_colour:
                          item.duration > 300
                            ? 'L'
                            : item.duration < 30
                            ? 'S'
                            : 'M',
                        middle_speed: 2000,
                        outer_yes: item.yes,
                        outer_no: item.no,
                        outer_speed: 3000,
                        outer_emoji: item.emolike,
                        topic: Array.isArray(item.keywords)
                          ? item.keywords[0]
                          : item.keywords.split(',').length > 0
                          ? item.keywords.split(',')[0]
                          : item.keywords,
                        duration: item.duration,
                        saved: item.saved === 1,
                        seen: item.seen === 1,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <ExpandEmolike emolike={item} index={index} />
              ),
            )
          ) : (
            <View style={styles.rowItem}></View>
          )}
        </View>
      </View>
    );
  };

  const renderPrivateAccount = () => {
    if (!userId || !userInfo.is_private) return;
    return (
      <View style={styles.privateWrap}>
        <PrivateAccountIcon />
        <Text style={styles.privateTxt}>
          {'This Account is Private\nFollow to see their posts'}
        </Text>
      </View>
    );
  };

  const renderFollowerSheet = () => {
    return (
      <FollowerSheet
        show={showFollowSheet}
        onClose={() => {
          setShowFollowSheet(false);
        }}
      />
    );
  };

  const renderFollowingSheet = () => {
    return (
      <FollowingSheet
        show={showFollowerSheet}
        onClose={() => {
          setShowFollowerSheet(false);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadFictionDebates(true);
          }
        }}>
        {renderHeader()}
        {renderUserInfo()}
        {renderEmolikes()}
        {renderPosting()}
        {renderActivities()}
        {renderPrivateAccount()}
      </ScrollView>
      {renderFollowerSheet()}
      {renderFollowingSheet()}
    </View>
  );
};

export default ProfilePage;
