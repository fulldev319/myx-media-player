/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityTabIcon,
  LockIcon,
  MemoriesTabIcon,
  SavedTabIcon,
  TaggedTabIcon,
} from 'assets/svg/profileIcons';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import SnackBar from 'react-native-snackbar-component';
import {apiSendFollowRequest, apiUnFollowPeople} from 'helper/userHelpers';
import {useDispatch, useSelector} from 'react-redux';
import appActions from 'redux/app/actions';
import profileActions from 'redux/profile/actions';

import {ActivityTab} from './components/ActivityTab';
import {MiniHeader} from './components/MiniHeader';
import {MemoriesTab} from './components/MemoriesTab';
import {TiktokTab} from './components/TiktokTab';
import {TaggedTab} from './components/TaggedTab';
import {FullHeader} from './components/FullHeader';
import {PlayListTab} from './components/PlayListTab';
import {LinkGrayIcon} from 'assets/svg';
import Svg, {G, Path} from 'react-native-svg';
import {setToken} from 'helper/storageHelper';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTracks} from 'contexts/TrackContext';
import {AddTrackPlayListPage} from './AddTrackPlayListPage';
import {RootState} from 'redux/interfaces';
import {MoreIcon} from './components/MiniHeader';
import {BackIcon} from 'screens/TrackPlayList/components/TrackPlayListIcons';
import {Platform} from 'react-native';

type ContextType = {
  translateY: number;
  state: string;
};

const tabData =
  Platform.OS === 'android'
    ? [
        {
          tab: 'Memories',
          icon: MemoriesTabIcon,
        },
        {
          tab: 'Tagged',
          icon: TaggedTabIcon,
        },
        {
          tab: 'Playlists',
          icon: SavedTabIcon,
        },
        {
          tab: 'Activity',
          icon: ActivityTabIcon,
        },
      ]
    : [
        {
          tab: 'Memories',
          icon: MemoriesTabIcon,
        },
        {
          tab: 'Tagged',
          icon: TaggedTabIcon,
        },
        {
          tab: 'Activity',
          icon: ActivityTabIcon,
        },
      ];

export const ProfilePage = ({
  isSelf,
  userInfo,
  userId,
  updateUserInfo,
  animStyle = null,
}) => {
  const {taggedRequestCount} = useSelector((state: RootState) => state.profile);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selTab, setSelTab] = useState('Memories');
  const [headerHeight, setHeaderHeight] = useState(70);

  const tabs =
    Platform.OS === 'android' && userInfo.hasTiktok
      ? [
          ...tabData,
          {
            tab: 'Tiktok',
            icon: MemoriesTabIcon,
          },
        ]
      : [...tabData];

  const {playTrackList, showPlayer} = useTracks();
  const [successCopy, setSuccesCopy] = useState(false);
  const topActionSheetRef = useRef<BottomSheetModal>(null);
  const logOutSheetRef = useRef<BottomSheetModal>(null);
  const confirmUnFollowSheetRef = useRef<BottomSheetModal>(null);
  const createPlaylistSheetRef = useRef<BottomSheetModal>(null);
  const snapPointsTopAction = useMemo(() => [230, 230], []);
  const snapPointsLogout = useMemo(() => [300, 300], []);
  const snapPointsUnFollow = useMemo(() => [300, 300], []);
  const snapPointsCreatePlaylist = useMemo(() => [600, 600], []);
  const [isOpenedSheet, setIsOpenedSheet] = useState(false);
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedSheet(false);
    } else {
      setIsOpenedSheet(true);
    }
    console.log('handleSheetChanges', index);
  }, []);

  const translateY = useSharedValue(0);
  const contextState = useSharedValue('up');

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      if (!context.state) {
        context.state = 'up';
      }
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      if (context.state === 'down') {
        if (event.translationY + context.translateY < headerHeight * -1) {
          context.translateY = translateY.value;
        } else {
          translateY.value = event.translationY + context.translateY;
        }
      } else {
        if (event.translationY + context.translateY > 0) {
          context.translateY = translateY.value;
        } else {
          translateY.value = event.translationY + context.translateY;
        }
      }
    },
    onEnd: (event, context) => {
      if (
        context.state === 'up' &&
        event.translationY + context.translateY < -100
      ) {
        context.state = 'down';
      } else if (
        context.state === 'down' &&
        event.translationY + context.translateY > 100 - headerHeight
      ) {
        context.state = 'up';
      }

      if (context.state === 'down') {
        translateY.value = withSpring(headerHeight * -1);
      } else {
        translateY.value = withSpring(0);
      }

      contextState.value = context.state;
    },
  });

  const upStyle = useAnimatedStyle(() => {
    let marginTop = translateY.value;
    let opacity = 1;
    let marginBottom = 0;

    if (contextState.value === 'up') {
      opacity = interpolate(translateY.value, [0, -250], [1, 0]);
    } else {
      marginBottom = withSpring(60);
    }

    return {
      marginTop: marginTop,
      opacity: opacity,
      marginBottom: marginBottom,
    };
  });

  const minStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [0, -250], [0, 1]);
    if (contextState.value === 'down') {
      return {
        opacity: 1,
      };
    }
    return {
      position: 'absolute',
      opacity: opacity,
    };
  });

  const minTopStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [0, -250], [1, 0]);
    if (contextState.value === 'down') {
      return {
        opacity: 0,
      };
    }
    return {
      position: 'absolute',
      opacity: opacity,
    };
  });

  const tabTopStyle = useAnimatedStyle(() => {
    const paddingTop = interpolate(translateY.value, [0, -250], [0, 30]);

    return {
      marginTop: paddingTop,
    };
  });

  useEffect(() => {
    const handleValidateClose = () => {
      if (isOpenedSheet) {
        logOutSheetRef.current.close();
        topActionSheetRef.current.close();
        return true;
      } else {
        return false;
      }
    };

    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleValidateClose,
    );

    return () => handler.remove();
  }, [isOpenedSheet]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(profileActions.refreshTaggedRequestCount(userId));
  };

  const requestFollow = () => {
    if (userId) {
      apiSendFollowRequest(userId).then(res => {
        if (res.success) {
          setTimeout(() => {
            dispatch(
              appActions.setSnakeSuccessMessage('Sent following request!'),
            );
            updateUserInfo();
          }, 500);
        }
      });
    }
  };

  const requestUnFollow = async () => {
    confirmUnFollowSheetRef.current?.close();
    const res = await apiUnFollowPeople(userInfo.id);

    if (res.success) {
      updateUserInfo();
    }
  };

  // const onCopyProfileLink = () => {
  //   dimissTopActionView();
  //   setSuccesCopy(true);
  //   Clipboard.setString('Profile URL copied to clipboard');

  //   setTimeout(() => {
  //     setSuccesCopy(false);
  //   }, 4000);
  // };

  const onGoToHelp = () => {
    dimissTopActionView();
    navigation.navigate('HelpAndSupportPage');
  };

  const onLogout = async () => {
    // playTrackList([]);
    createPlaylistSheetRef.current?.close();
    confirmUnFollowSheetRef.current?.close();
    logOutSheetRef.current?.close();

    setTimeout(async () => {
      topActionSheetRef.current?.close();

      setTimeout(async () => {
        await setToken('');
        navigation.navigate('LoginNavigator');
      }, 500);
    }, 500);
  };

  const onCreatePlaylist = () => {
    onDismissAllDlg();

    createPlaylistSheetRef.current?.present();
  };

  const onCreatedPlaylist = playlistId => {
    onDismissAllDlg();
    navigation.navigate('TrackPlayListPage', {
      playlistId,
    });
  };

  const onUnFollow = async personId => {
    setIsOpenedSheet(true);
    confirmUnFollowSheetRef.current?.present();
  };

  const onOpenTopActionView = () => {
    setIsOpenedSheet(true);
    createPlaylistSheetRef.current?.close();
    confirmUnFollowSheetRef.current?.close();

    setTimeout(async () => {
      topActionSheetRef.current?.present();
    }, 500);
  };

  const dimissTopActionView = () => {
    setIsOpenedSheet(false);
    topActionSheetRef.current?.close();
  };

  const onDismissAllDlg = () => {
    createPlaylistSheetRef.current?.close();
    topActionSheetRef.current?.close();
    logOutSheetRef.current?.close();
    confirmUnFollowSheetRef.current?.close();
  };

  const renderTopAction = () => {
    return (
      <BottomSheetModal
        ref={topActionSheetRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.34)',
          marginTop: 20,
        }}
        snapPoints={snapPointsTopAction}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {top: 20, left: 20, right: 20}]}>
          {/* <TouchableOpacity
            style={styles.actionBtnContainer}
            onPress={onCopyProfileLink}>
            <LinkGrayIcon />
            <Text style={styles.btnText}>Copy Profile URL</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.actionBtnContainer}
            onPress={onGoToHelp}>
            <LinkGrayIcon />
            <Text style={styles.btnText}>Help and Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtnContainer}
            onPress={() => {
              dimissTopActionView();

              setTimeout(() => {
                setIsOpenedSheet(true);
                logOutSheetRef.current?.present();
              }, 200);
            }}>
            <LogoutIcon />
            <Text style={[styles.btnText, {color: '#FF6651'}]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  };

  const renderSnackbar = () => {
    return (
      <SnackBar
        visible={successCopy}
        textMessage={() => {
          return (
            <View style={styles.snackBarContainer}>
              <View style={styles.storySnackContainer}>
                <Text style={styles.storySnackText}>
                  {'Profile URL copied to clipboard'}
                </Text>
              </View>
            </View>
          );
        }}
        position={'top'}
        top={60}
        autoHidingTime={3000}
        backgroundColor={'transparent'}
      />
    );
  };

  const renderSureLogoutDialog = () => {
    return (
      <BottomSheetModal
        ref={logOutSheetRef}
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
        snapPoints={snapPointsLogout}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {top: 10, left: 34, right: 34}]}>
          <Text style={styles.sureLogoutTitleTxt}>
            {'Are you sure want to \nlogout?'}
          </Text>
          <TouchableOpacity style={styles.meOutContainer} onPress={onLogout}>
            <Text style={styles.btnText}>Yes, log me out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logOutCancelContainer}
            onPress={() => {
              logOutSheetRef.current?.close();
            }}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
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
            {`Confirm remove \n@${userInfo.username}`}
          </Text>
          <TouchableOpacity
            style={styles.meOutContainer}
            onPress={requestUnFollow}>
            <Text style={styles.btnText}>Yes, remove {userInfo.username}</Text>
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

  const renderCreateNewPlaylist = () => {
    return (
      <BottomSheetModal
        ref={createPlaylistSheetRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: 'gray',
          marginVertical: 10,
        }}
        snapPoints={snapPointsCreatePlaylist}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {top: 10, left: 34, right: 34}]}>
          <AddTrackPlayListPage
            onFinished={playlistId => {
              onCreatedPlaylist(playlistId);
            }}
            onClose={() => {
              onDismissAllDlg();
            }}
          />
        </View>
      </BottomSheetModal>
    );
  };

  const renderTaggedBadge = () => {
    return (
      <View style={styles.taggedCountView}>
        <Text style={styles.taggedCountText}>{taggedRequestCount}</Text>
      </View>
    );
  };

  const onShowAtionSheet = () => {
    onOpenTopActionView();
  };

  return (
    <>
      {!isSelf && userInfo.isPrivate ? (
        <View style={[styles.root]}>
          <View style={styles.header}>
            <FullHeader
              setHeaderHeight={setHeaderHeight}
              isSelf={isSelf}
              userInfo={userInfo}
              requestFollow={requestFollow}
              animStyle={animStyle}
              onClickDetail={onOpenTopActionView}
              onDismissDlg={onDismissAllDlg}
            />
          </View>
          <Animated.View style={[{width: '100%'}, minTopStyle]}>
            {!isSelf && (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  position: 'absolute',
                  top: 38,
                  left: 16,
                  padding: 10,
                }}>
                <BackIcon />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onShowAtionSheet}
              style={{
                position: 'absolute',
                top: 40,
                right: 16,
                padding: 10,
              }}>
              <MoreIcon />
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.lock}>
            <LockIcon style={{marginBottom: 15}} />
            <Text style={styles.lockTxt}>This Account Is Private</Text>
            <Text style={styles.lockTxt}>Follow to see their posts</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.root, {paddingBottom: showPlayer ? 144 : 72}]}>
          <PanGestureHandler onGestureEvent={panGestureEvent}>
            <Animated.View style={styles.header}>
              <Animated.View style={[{width: '100%'}, upStyle]}>
                <FullHeader
                  setHeaderHeight={setHeaderHeight}
                  isSelf={isSelf}
                  userInfo={userInfo}
                  requestFollow={requestFollow}
                  animStyle={animStyle}
                  onClickDetail={onOpenTopActionView}
                  onUnFollow={onUnFollow}
                  onDismissDlg={onDismissAllDlg}
                />
              </Animated.View>
              <Animated.View style={[{width: '100%'}, minStyle]}>
                <MiniHeader
                  showName={true}
                  isSelf={isSelf}
                  userInfo={userInfo}
                  onClickedAction={onShowAtionSheet}
                />
              </Animated.View>
              <Animated.View style={[{width: '100%'}, minTopStyle]}>
                {!isSelf && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.goBack();
                    }}
                    style={{
                      position: 'absolute',
                      top: 38,
                      left: 16,
                      padding: 10,
                    }}>
                    <BackIcon />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={onShowAtionSheet}
                  style={{
                    position: 'absolute',
                    top: 40,
                    right: 16,
                    padding: 10,
                  }}>
                  <MoreIcon />
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={[styles.tabs, tabTopStyle]}>
                {tabs.map(tabInfo => (
                  <TouchableOpacity
                    onPress={() => setSelTab(tabInfo.tab)}
                    style={[
                      styles.tab,
                      selTab === tabInfo.tab ? styles.activeTab : {},
                    ]}>
                    {tabInfo.icon({isSel: selTab === tabInfo.tab})}
                    {selTab === tabInfo.tab && (
                      <Text style={styles.tabText}>{tabInfo.tab}</Text>
                    )}
                    {isSelf &&
                      taggedRequestCount !== 0 &&
                      tabInfo.tab === 'Tagged' &&
                      selTab !== 'Tagged' &&
                      renderTaggedBadge()}
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
          <View style={styles.content}>
            {selTab === 'Memories' && <MemoriesTab userId={userId} />}
            {selTab === 'Tiktok' && <TiktokTab userId={userId} />}
            {selTab === 'Tagged' && <TaggedTab userId={userId} />}
            {selTab === 'Playlists' && Platform.OS === 'android' && (
              <PlayListTab
                isSelf={isSelf}
                onAddPlaylist={() => {
                  onCreatePlaylist();
                }}
                userInfo={userInfo}
              />
            )}
            {selTab === 'Activity' && <ActivityTab userId={userId} />}
          </View>
        </View>
      )}
      {renderSureLogoutDialog()}
      {renderSureUnFollow()}
      {renderSnackbar()}
      {renderTopAction()}
      {renderCreateNewPlaylist()}
    </>
  );
};

export const LogoutIcon = props => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <G
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      opacity="0.4">
      <Path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </G>
  </Svg>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {},
  tabs: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 14,
    paddingHorizontal: 28,
    borderBottomColor: '#212121',
    borderTopColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'space-between',
    marginTop: 0,
  },
  tab: {
    height: 36,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 102, 81, 0.3);',
  },
  tabText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FF6651',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  lock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    opacity: 0.6,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    height: 56,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
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
  snackBarContainer: {width: '100%', alignItems: 'center'},
  storySnackContainer: {
    width: '80%',
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    alignItems: 'center',
    borderRadius: 9,
    flexDirection: 'row',
    padding: 16,
  },
  storySnackText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
    marginStart: 16,
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
  taggedCountView: {
    width: 20,
    height: 16,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#FF6651',
    borderColor: 'black',
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taggedCountText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 8,
    color: '#FFFFFF',
  },
});
