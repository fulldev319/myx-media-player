/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {PlayIcon} from 'assets/svg';
import {useNavigation} from '@react-navigation/native';
import {
  apiGetUserListening,
  getDefaultAvatar,
  apiGetSlambookRooms,
} from 'helper/userHelpers';
import LinearGradient from 'react-native-linear-gradient';
import {useEvent} from 'react-native-reanimated';
import {RootState} from 'redux/interfaces';
import {useTracks} from 'contexts/TrackContext';
import {convertTimeFormat} from 'helper/utils';
import {socket} from 'screens/Auth';
import FollowersUserIcon from 'assets/svg/FollowersUser';
import FollowingUserIcon from 'assets/svg/FollowingUser';
import HexagonIcon from 'assets/svg/Hexagon';
import HeadphoneIcon from 'assets/svg/Headphone';
import ArrowRightIcon from 'assets/svg/arrowRight';
import ProfileEditIcon from 'assets/svg/ProfileEdit';
import ArrowBigRight from 'assets/svg/ArrowBigRight';
import {WhiteMicIcon} from 'assets/svg';

export const FullHeader = ({
  setHeaderHeight,
  isSelf,
  userInfo,
  requestFollow,
  animStyle = null,
  onClickDetail = null,
  onUnFollow = null,
  onDismissDlg = null,
}) => {
  const {navigate} = useNavigation();
  const {goBack} = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const {getArtistsStr, playTrack} = useTracks();
  const [listening, setListening] = useState<any>();

  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingData, setLoadingData] = useState<Boolean>(false);
  const [lastId, setLastId] = useState(null);
  const [arrSlamData, setArrSlamData] = useState([]);

  useEvent(() => {
    if (userInfo.id) {
      getUserListening();
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket && user.id) {
      const setListeningHandler = _listening => {
        if (_listening.userId === user.id) {
          setListening({
            ..._listening.trackData,
            trackId: _listening.trackData.id,
          });
        }
      };

      socket.on('newListening', setListeningHandler);
      return () => {
        socket.removeListener('newListening', setListeningHandler);
      };
    }
  }, [socket, user.id]);

  useEffect(() => {
    loadSlambookRooms();
  }, []);

  const loadSlambookRooms = async () => {
    setLoadingData(true);
    const params = {
      offset: lastId,
    };
    const res = await apiGetSlambookRooms(params);
    if (res.success) {
      setHasMoreData(res.hasMore);
      setLastId(res.lastId);
      if (res.data) {
        if (res.data.length > 2) {
          setArrSlamData([res.data[0], res.data[1]]);
        } else {
          setArrSlamData(res.data);
        }
      }
    } else {
      setHasMoreData(false);
    }
  };

  const openPlayer = () => {
    if (listening) {
      playTrack({...listening, id: listening.trackId});
      navigate('FullMusicPlayer');
    }
  };

  const gotoChatRoom = () => {
    dispatch(
      chatActions.setCurrentChat({
        users: {
          userFrom: {userId: user.id},
          userTo: {userId: userInfo.id},
        },
      }),
    );

    onDismissDlg();
    setTimeout(() => {
      navigate('ChatRoom');
    }, 300);
  };

  const getUserListening = () => {
    apiGetUserListening(userInfo.id).then(res => {
      if (res.success) {
        setListening(res.data);
      }
    });
  };

  const goToFollowing = () => {
    onDismissDlg();

    setTimeout(() => {
      if (isSelf) {
        navigate('FollowingPage');
      } else {
        navigate('OtherFollowingPage', {user: userInfo});
      }
    }, 300);
  };

  return (
    <View
      style={styles.mainContainer}
      onLayout={event => {
        setHeaderHeight(event.nativeEvent.layout.height);
      }}>
      <View style={styles.background}>
        <LinearGradient
          colors={['rgba(255, 112, 31, 0.8)', '#FF701F10']}
          style={{
            position: 'absolute',
            height: 400,
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0.5,
          }}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 24,
              flexDirection: 'row',
              width: '100%',
            }}>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 24,
                minWidth: 200,
                borderRightColor: '#ffffff20',
                borderRightWidth: 1,
              }}>
              <View style={{position: 'relative'}}>
                <Image
                  style={styles.userImage}
                  resizeMode="cover"
                  source={
                    userInfo?.profileImage
                      ? {uri: userInfo?.profileImage}
                      : getDefaultAvatar()
                  }
                />
                <TouchableOpacity
                  style={{position: 'absolute', bottom: 8, left: 70}}
                  onPress={() => {
                    navigate('EditProfilePage');
                  }}>
                  <ProfileEditIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailInfoName} numberOfLines={2}>
                  {userInfo?.username}
                </Text>
                <Text style={styles.detailInfoNick} numberOfLines={2}>
                  {userInfo?.handle}
                </Text>
              </View>
            </View>
            <View style={{paddingHorizontal: 16, paddingVertical: 24}}>
              <TouchableOpacity onPress={goToFollowing}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                  <FollowersUserIcon />
                  <Text
                    style={{
                      color: '#ffffff40',
                      fontSize: 10,
                      fontWeight: '500',
                      marginLeft: 6,
                    }}>
                    Followers
                  </Text>
                </View>
                <Text style={styles.txtBoldFollow}>{userInfo?.followers}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={goToFollowing}
                style={{marginVertical: 16}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                  <FollowingUserIcon />
                  <Text
                    style={{
                      color: '#ffffff40',
                      fontSize: 10,
                      fontWeight: '500',
                      marginLeft: 6,
                    }}>
                    Following
                  </Text>
                </View>
                <Text style={styles.txtBoldFollow}>{userInfo?.followings}</Text>
              </TouchableOpacity>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                  <HexagonIcon />
                  <Text
                    style={{
                      color: '#ffffff40',
                      fontSize: 10,
                      fontWeight: '500',
                      marginLeft: 6,
                    }}>
                    C-Points
                  </Text>
                </View>
                <Text style={styles.txtBoldFollow}>{'193,390 pts'}</Text>
              </View>
            </View>
          </View>
        </View>
        {isSelf && Platform.OS === 'android' && (
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 18,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <HeadphoneIcon />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: '#fff',
                  marginLeft: 14,
                }}>
                Manage My Music
              </Text>
            </View>
            <TouchableOpacity
              style={{opacity: 0.4}}
              onPress={() => navigate('ManageMusicPage')}>
              <ArrowRightIcon />
            </TouchableOpacity>
          </View>
        )}
        {isSelf && arrSlamData.length > 0 && (
          <View style={{marginTop: 24}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: '#fff',
                }}>
                Scheduled Voice Room
              </Text>

              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: '#FF6651',
                  }}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {arrSlamData.map(item => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      width: 32,
                      height: 32,
                      borderRadius: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8,
                    }}>
                    <WhiteMicIcon />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#fff',
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '400',
                        color: '#fff',
                        marginTop: 2,
                      }}>
                      Aug 12, 07:30 AM
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={{marginRight: 6}}>
                  <ArrowBigRight />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        {/* <View style={styles.header}>
          <View style={styles.left}>
            {(!isSelf || animStyle?.goBack) && (
              <Animated.View style={[animStyle?.btnStyle]}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    if (animStyle?.goBack) {
                      animStyle?.goBack();
                    } else {
                      goBack();
                    }
                  }}>
                  <BackIcon />
                </TouchableOpacity>
              </Animated.View>
            )}
            <View style={styles.info}>
              <Animated.View
                style={[styles.userImageContainer1, animStyle?.avatarStyle]}>
                <View style={styles.userImageContainer2}>
                  <View style={styles.userImageContainer3}>
                    <Image
                      style={styles.userImage}
                      resizeMode="cover"
                      source={
                        userInfo?.profileImage
                          ? {uri: userInfo?.profileImage}
                          : getDefaultAvatar()
                      }
                    />
                  </View>
                </View>
              </Animated.View>
              <Animated.View style={[styles.detail, animStyle?.infoStyle]}>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailInfoName} numberOfLines={2}>
                    {userInfo?.username}
                  </Text>
                  <Text style={styles.detailInfoNick} numberOfLines={2}>
                    {userInfo?.handle}
                  </Text>
                </View>
              </Animated.View>
            </View>
          </View>
          <View style={styles.right}>
            <Animated.View style={[animStyle?.btnStyle]}>
              <TouchableOpacity
                onPress={() => {
                  onClickDetail && onClickDetail();
                }}
                style={styles.actionBtn}>
                <DetailHorizontalIcon />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View> */}
        <View style={styles.descriptionContainer}>
          {/* <Text style={styles.description}>{userInfo?.description}</Text>
          <TouchableOpacity
            style={styles.followInfoContainer}
            onPress={() => {
              goToFollowing();
            }}>
            <View style={styles.followersContainer}>
              <Text style={styles.txtBoldFollow}>{userInfo?.followers}</Text>
              <Text style={styles.txtNormalFollow}>followers</Text>
            </View>
            <View style={styles.followingContainer}>
              <Text style={styles.txtBoldFollow}>{userInfo?.followings}</Text>
              <Text style={styles.txtNormalFollow}>followings</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.actionContainer}>
            {isSelf ? (
              <TouchableOpacity
                style={styles.btnEditProfile}
                onPress={() => {
                  navigate('EditProfilePage');
                }}>
                <Text style={styles.txtBtnEditProfile}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.otherAction}>
                {userInfo.isFollowing==='true' ? (
                  <TouchableOpacity
                    style={styles.btnOtherAction}
                    onPress={() => {
                      onUnFollow && onUnFollow(userInfo.id);
                    }}>
                    <Text style={styles.txtOtherAction}>Following</Text>
                  </TouchableOpacity>
                ) : userInfo.isFollowed === 'true ? (
                  <TouchableOpacity style={styles.btnOtherAction}>
                    <Text style={styles.txtOtherAction}>Follow</Text>
                  </TouchableOpacity>
                ) : userInfo.isFollowing === 'requested' ||
                  userInfo.isFollowed === 'requested' ? (
                  <TouchableOpacity style={styles.btnOtherAction}>
                    <Text style={styles.txtOtherAction}>Requested</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.btnOtherActiveAction}
                    onPress={requestFollow}>
                    <Text style={styles.txtOtherAction}>Follow</Text>
                  </TouchableOpacity>
                )}
                {!userInfo?.isPrivate && (
                  <TouchableOpacity
                    style={styles.btnOtherAction}
                    onPress={gotoChatRoom}>
                    <Text style={styles.txtOtherAction}>Chat</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View> */}
          <Text style={styles.itemUserName}>{JSON.stringify(listening)}</Text>
          {listening && (isSelf || !userInfo?.isPrivate) && (
            <View style={styles.listeningConatiner}>
              <Text style={styles.txtNowListening}>
                {listening?.listeningNow ? 'Now Listening' : 'Last Listening'}
              </Text>
              <TouchableOpacity
                style={styles.listenItemContainer}
                onPress={openPlayer}>
                <Image
                  style={styles.itemImage}
                  source={
                    listening?.image
                      ? {uri: listening?.image}
                      : getDefaultAvatar()
                  }
                  resizeMode="cover"
                />
                <View style={styles.itemInfoContainer}>
                  <View>
                    <Text
                      style={styles.itemUserName}
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {JSON.stringify(listening)}
                    </Text>
                    <Text
                      style={styles.itemUserInfo}
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {getArtistsStr(listening?.artists)}
                    </Text>
                  </View>
                  <View>
                    <PlayIcon />
                    <Text style={[styles.itemUserInfo, {marginTop: 5}]}>
                      {convertTimeFormat(listening?.duration ?? 0)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  container: {
    width: '100%',
    paddingHorizontal: 28,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: 202,
  },
  header: {
    width: '100%',
    marginTop: 85,
    flexDirection: 'row',
  },
  actionBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  left: {
    flex: 1,
  },
  right: {},
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImageContainer1: {
    width: 114,
    height: 114,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(47, 155, 255, 0.2)',
  },
  userImageContainer2: {
    width: 106,
    height: 106,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(47, 155, 255, 0.3)',
  },
  userImageContainer3: {
    width: 97,
    height: 97,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 55,
    borderWidth: 1,
    borderColor: 'rgba(47, 155, 255, 0.5)',
  },
  userImage: {
    width: 84,
    height: 84,
    borderRadius: 50,
  },
  detail: {flex: 1},
  detailInfo: {
    marginTop: 12,
  },
  detailInfoName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 24,
    color: '#FFFFFF',
  },
  detailInfoNick: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 4,
  },
  descriptionContainer: {
    marginVertical: 4,
  },
  description: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF99',
  },
  followInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  followersContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  followingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 15,
  },
  txtBoldFollow: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  txtNormalFollow: {
    color: '#FFFFFF99',
    fontWeight: '400',
    fontSize: 14,
    fontFamily: 'Poppins',
    marginStart: 5,
  },
  actionContainer: {
    marginTop: 24,
  },
  btnEditProfile: {
    height: 37,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtnEditProfile: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  otherAction: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  btnOtherActiveAction: {
    flex: 1,
    height: 37,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FF6651',
    marginHorizontal: 4,
  },
  btnOtherAction: {
    flex: 1,
    height: 37,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  txtOtherAction: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    zIndex: 1000,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
  },
  listeningConatiner: {
    height: 75,
    display: 'flex',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 24,
    paddingHorizontal: 12,
  },
  txtNowListening: {
    top: -10,
    left: 10,
    paddingHorizontal: 5,
    color: 'white',
    fontSize: 10,
    lineHeight: 15,
    position: 'absolute',
    backgroundColor: '#000000',
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
  },
  listenItemContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 42,
    justifyContent: 'center',
  },
  itemImage: {
    width: 42,
    height: 42,
  },
  itemInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginStart: 12,
  },
  itemUserName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
  },
  itemUserInfo: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '300',
    opacity: 0.6,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
  },
});
