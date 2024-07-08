/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import BgLeft from 'assets/images/full_music_player_bg_left.png';
import BgRight from 'assets/images/full_music_player_bg_right.png';
import {
  BookMarkIcon,
  DropDawnIcon,
  NextPlayIcon,
  NextSecIcon,
  PauseIcon,
  PlayIcon,
  PrevPlayIcon,
  PrevSecIcon,
  RepeatOnePlayIcon,
  RepeatPlayIcon,
  SufflePlayIcon,
} from './components/musicPlayerIcons';
import PlusIcon from 'assets/svg/PlusIcon';
import {ScrollView} from 'react-native-gesture-handler';
// import Slider from 'react-native-elements/dist/slider/Slider';
import Slider from 'react-native-slider';
import {useNavigation} from '@react-navigation/native';
import TaggedSheet from '@gorhom/bottom-sheet';
import {PlayingStatus, TrackRepeatMode, useTracks} from 'contexts/TrackContext';
import {apiGetTrackMemories} from 'helper/trackHelpers';
import {MemeberGroup} from 'components/memberGroup';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import {TrackMemoryCard} from './TrackMemoryCard';
import {AddToPlayList} from './components/AddToPlayList';
import {BlurView} from '@react-native-community/blur';
import {WhiteSendIcon} from 'assets/svg';
import {SearchBar} from 'components/common/SearchBar';
import CardSendChat from './components/CardSendChat';
import {apiGetFollowings, apiGetSearchUsers} from 'helper/userHelpers';
import {RootState} from 'redux/interfaces';
import {useDispatch, useSelector} from 'react-redux';
import chatActions from 'redux/chats/actions';
import * as Progress from 'react-native-progress';

import MessageList from 'screens/chat/MessageList';
import {apiShareTrack} from 'helper/chatHelpers';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export const FullMusicPlayer = ({
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {navigate, goBack} = useNavigation();
  const {
    curTrack,
    trackDuration,
    trackPosition,
    seekTime,
    togglePlayer,
    playingStatus,
    repeatMode,
    setRepeatMode,
    playPrevTrack,
    playNextTrack,
    playPrevSecs,
    playNextSecs,
    clearTracks,
    playTrackList,
  } = useTracks();
  const dispatch = useDispatch();
  const taggedSheetRef = useRef<TaggedSheet>(null);
  const sendSheetRef = useRef<TaggedSheet>(null);
  const chatSheetRef = useRef<TaggedSheet>(null);
  const snapPoints = useMemo(() => [70, 70, '95%'], []);
  const sendSnapPoints = useMemo(() => ['70%', '70%'], []);
  const chatSnapPoints = useMemo(() => ['70%', '70%'], []);

  const {user} = useSelector((state: RootState) => state.auth);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [arrMemories, setArrMemories] = useState([]);
  const [showAddToPlayList, setShowAddToPlayList] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [playListId, setPlayListId] = useState('');

  const [searchText, setSearchText] = useState('');
  const [arrUsers, setArrUsers] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false);
        setPlayListId('');
      }, 3000);
    }
  }, [showMessage]);

  useEffect(() => {
    loadTrackMemories();
    loadUserFollowings();
  }, []);

  const loadTrackMemories = async () => {
    if (hasMore) {
      const res = await apiGetTrackMemories(lastId, curTrack?.id);

      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setArrMemories(prev => [...prev, ...res.data]);
      }
    }
  };

  const loadUserFollowings = async () => {
    const res = await apiGetFollowings(user.id, null);

    if (res.success) {
      setArrUsers(res.data);
    }
  };

  const onAddToChat = userId => {
    sendSheetRef.current.forceClose();

    setTimeout(() => {
      chatSheetRef.current.snapToIndex(1);
    }, 500);
  };

  const onSelectedChat = async chatInfo => {
    setShowLoading(true);
    clearTracks();

    const roomId = chatInfo.id;
    const fromId = user.id;
    let toId = '';
    if (
      chatInfo.users &&
      chatInfo.users.userFrom &&
      chatInfo.users.userFrom.id === user.id
    ) {
      toId = chatInfo.users.userTo.id;
    } else if (
      chatInfo.users &&
      chatInfo.users.userTo &&
      chatInfo.users.userTo.id === user.id
    ) {
      toId = chatInfo.users.userFrom.id;
    }

    const shareData = {
      shareId: curTrack.id,
      type: 'track',
      item: 'share',
    };

    const res = await apiShareTrack(roomId, fromId, toId, shareData);

    if (res.success) {
      setTimeout(() => {
        goBack();

        dispatch(
          chatActions.setCurrentChat({
            users: {
              userFrom: {userId: user.id},
              userTo: {userId: toId},
            },
          }),
        );
        setShowLoading(false);
        navigate('ChatRoom');
      }, 1000);
    } else {
      setShowLoading(false);
    }
  };

  const onChangeSuffle = () => {
    if (repeatMode !== TrackRepeatMode.Shuffle) {
      setRepeatMode(TrackRepeatMode.Shuffle);
      // todo show message.
    } else {
      setRepeatMode(TrackRepeatMode.None);
    }
  };

  const onChangeRepeat = () => {
    if (repeatMode === TrackRepeatMode.Repeat) {
      setRepeatMode(TrackRepeatMode.OneRepeat);
    } else if (repeatMode === TrackRepeatMode.OneRepeat) {
      setRepeatMode(TrackRepeatMode.None);
    } else {
      setRepeatMode(TrackRepeatMode.Repeat);
    }
  };

  const onAddMemory = () => {
    navigation.navigate('AddMemoryPage', {songId: curTrack?.id});
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // const onChangedSearch = text => {
  //   setSearchText(text);
  //   loadSearchUser();
  // };

  const loadSearchUser = async text => {
    if (text !== '') {
      const res = await apiGetSearchUsers(text, null);

      if (res.success) {
        setArrUsers(prev => [...res.data]);
      }
    }
  };

  const renderTaggedSheet = () => {
    return (
      <TaggedSheet
        ref={taggedSheetRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderTopLeftRadius: 45,
          borderTopRightRadius: 45,
        }}
        handleIndicatorStyle={{backgroundColor: 'rgba(255, 255, 255, 0.34)'}}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {alignItems: 'center'}]}>
          <Text style={styles.memeHeaderTitle}>Memories</Text>
          <ScrollView
            style={styles.memoryBody}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                loadTrackMemories();
              }
            }}
            scrollEventThrottle={500}>
            <View style={{marginBottom: 50}}>
              {arrMemories.map(itemData => {
                return <TrackMemoryCard data={itemData} onClick={() => {}} />;
              })}
            </View>
          </ScrollView>
        </View>
      </TaggedSheet>
    );
  };

  const renderSendSheet = () => {
    return (
      <TaggedSheet
        ref={sendSheetRef}
        index={-1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderTopLeftRadius: 45,
          borderTopRightRadius: 45,
        }}
        handleIndicatorStyle={{backgroundColor: 'rgba(255, 255, 255, 0.34)'}}
        snapPoints={sendSnapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {padding: 28}]}>
          <Text style={styles.sendDlgTitle}>Send to Chats</Text>
          <SearchBar
            value={searchText}
            txtPlaceholder="Search here..."
            onChangedText={loadSearchUser}
            style={{height: 44, marginTop: 18}}
          />
          <ScrollView
            style={styles.memoryBody}
            showsVerticalScrollIndicator={false}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
              }
            }}
            scrollEventThrottle={500}>
            {arrUsers.map((item, index) => {
              return (
                <CardSendChat
                  data={item}
                  key={`send_chat_card_${index}`}
                  onSendChat={onAddToChat}
                />
              );
            })}
          </ScrollView>
        </View>
      </TaggedSheet>
    );
  };

  const renderChatSheet = () => {
    return (
      <TaggedSheet
        ref={chatSheetRef}
        index={-1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderTopLeftRadius: 45,
          borderTopRightRadius: 45,
        }}
        handleIndicatorStyle={{backgroundColor: 'rgba(255, 255, 255, 0.34)'}}
        snapPoints={chatSnapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {padding: 28}]}>
          <Text style={styles.sendDlgTitle}>Chats</Text>
          <ScrollView
            style={styles.memoryBody}
            showsVerticalScrollIndicator={false}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
              }
            }}
            scrollEventThrottle={500}>
            <MessageList
              fromChat={false}
              onSelectedChat={chat => onSelectedChat(chat)}
            />
          </ScrollView>
        </View>
      </TaggedSheet>
    );
  };

  const renderAddMemoryView = () => {
    return (
      <TouchableHighlight
        onPress={() => {
          onAddMemory();
        }}
        style={styles.memoAddView}>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <MemeberGroup isDummy={true} />
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <View style={styles.root}>
      <View style={[StyleSheet.absoluteFill, styles.background]}>
        <Image source={BgLeft} style={styles.backgroundLeft} />
        <Image source={BgRight} style={styles.backgroundRight} />
      </View>
      <View style={[StyleSheet.absoluteFill, styles.content]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerAction} onPress={goBack}>
            <DropDawnIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Music Player</Text>
          <View style={styles.headerActionContainer}>
            <TouchableOpacity
              style={styles.headerAction}
              onPress={() => {
                sendSheetRef.current.snapToIndex(1);
              }}>
              <WhiteSendIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerAction}
              onPress={() => {
                setShowAddToPlayList(true);
              }}>
              <BookMarkIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.backgroundImage}>
          <Image
            source={{
              uri: curTrack
                ? curTrack.artwork
                : 'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg',
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          {/* {arrMemories.length > 0 && renderAddMemoryView()} */}
          {showMessage && (
            <View style={styles.messageContainer}>
              <View style={styles.message}>
                <BlurView
                  style={styles.messageBlur}
                  blurAmount={15}
                  blurType="light"
                />
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.messageTxt}>Successfully save song</Text>
                  <View style={styles.divider} />
                  <TouchableOpacity
                    onPress={() => {
                      navigate('TrackPlayListPage', {playlistId: playListId});
                    }}>
                    <Text style={styles.messageActionTxt}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.sidePlusButton}>
          <TouchableOpacity
            onPress={() => {
              onAddMemory();
            }}
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#08B883',
              borderRadius: 32,
            }}>
            <PlusIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
          {curTrack && curTrack.title}
        </Text>
        <Text style={styles.description} ellipsizeMode="tail" numberOfLines={1}>
          {curTrack && curTrack.artist}
        </Text>
        <View style={styles.slideContainer}>
          <Slider
            onSlidingComplete={seekTime}
            // onValueChange={value => {}}
            value={Math.min(trackPosition, trackDuration)}
            minimumValue={0}
            maximumValue={trackDuration}
            minimumTrackTintColor="#FF6651"
            maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
            thumbTintColor="transparent"
            thumbStyle={{width: 0}}
          />
        </View>
        <View style={styles.control}>
          <TouchableOpacity onPress={playPrevSecs}>
            <PrevSecIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={playPrevTrack}>
            <PrevPlayIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayer}>
            <View
              style={{
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {playingStatus === PlayingStatus.Loading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : playingStatus === PlayingStatus.Playing ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={playNextTrack}>
            <NextPlayIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNextSecs}>
            <NextSecIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.control}>
          <TouchableOpacity onPress={onChangeSuffle}>
            {repeatMode === TrackRepeatMode.Shuffle ? (
              <SufflePlayIcon isActive={true} />
            ) : (
              <SufflePlayIcon />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onChangeRepeat}>
            {repeatMode === TrackRepeatMode.Repeat ? (
              <RepeatPlayIcon isActive={true} />
            ) : repeatMode === TrackRepeatMode.OneRepeat ? (
              <RepeatOnePlayIcon isActive={true} />
            ) : (
              <RepeatPlayIcon />
            )}
          </TouchableOpacity>
        </View>
        <View style={{height: 106}} />
      </View>
      {renderTaggedSheet()}
      {renderSendSheet()}
      {renderChatSheet()}
      <AddToPlayList
        isOpenedSheet={showAddToPlayList}
        onCloseSheet={() => {
          setShowAddToPlayList(false);
        }}
        onSuccess={_playListId => {
          setShowMessage(true);
          setPlayListId(_playListId);
        }}
      />
      {/* <View
        style={[
          StyleSheet.absoluteFill,
          styles.memories,
          {
            transform: [{translateY: screenHeight - 130}],
          },
        ]}>
        <View style={styles.memHeader}>
          <TouchableOpacity style={[styles.memheaderAction]}>
            <View style={styles.memeHeaderActionIcon} />
          </TouchableOpacity>
          <Text style={styles.memeHeaderTitle}>Memories</Text>
        </View>
        <View style={styles.memContent}>
          <TouchableOpacity style={[styles.addMemBtn]}>
            <AddMemoryIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.minPlayerContainer}>
          <Image
            source={{uri: curTrack.image}}
            style={styles.minBgImage}
            resizeMode="cover"
          />
          <View style={styles.minContent}>
            <View style={styles.minInfo}>
              <Text style={styles.minInfoTxt}>{curTrack.title}</Text>
              <MinDivider style={{paddingHorizontal: 8}} />
              <Text style={styles.minInfoTxt}>
                {curTrack.artist}
              </Text>
            </View>
            <View style={styles.minAction}>
              <TouchableOpacity onPress={playPrevTrack}>
                <MinPrevPlayIcon />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayer}>
                <View
                  style={{
                    width: 25,
                    height: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {playingStatus === PlayingStatus.Playing ? (
                    <MinPauseIcon />
                  ) : (
                    <MinPlayIcon />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={playNextTrack}>
                <MinNextPlayIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View> */}
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
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundLeft: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
  },
  backgroundRight: {
    position: 'absolute',
    right: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 26,
  },
  header: {
    marginTop: 74,
    marginBottom: 43,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerActionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerAction: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  backgroundImage: {
    flex: 1,
    borderRadius: 24,
  },
  title: {
    marginTop: 38,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 20,
    color: '#FFFFFF',
  },
  description: {
    marginTop: 8,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  slideContainer: {},
  control: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Memories
  memories: {
    top: 60,
    flex: 1,
    backgroundColor: '#1f1f1f',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  memHeader: {
    alignItems: 'center',
  },
  memheaderAction: {
    width: 50,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memeHeaderActionIcon: {
    width: 48,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  memeHeaderTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  memContent: {
    flex: 1,
  },
  sendDlgTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  addMemBtn: {
    // position: 'absolute',
    // right: 26,
    // bottom: 66,
    // zIndex: 100,
  },
  // min player
  minPlayerContainer: {
    height: 91,
    backgroundColor: '#292929',
    paddingLeft: 32,
    paddingRight: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  minBgImage: {
    height: 48,
    width: 48,
    borderRadius: 16,
  },
  minContent: {
    paddingHorizontal: 8,
  },
  minInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minInfoTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  minAction: {
    marginTop: 4,
    width: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoAddView: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    width: 100,
    height: 56,
    backgroundColor: 'rgba(40, 40, 40, 0.4)',
    borderTopStartRadius: 16,
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'grey',
    marginHorizontal: 10,
  },
  textAddPlus: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  memoryBody: {
    flex: 1,
    marginTop: 10,
  },
  messageContainer: {
    top: -22,
    width: '100%',
    height: 44,
    position: 'absolute',
    paddingHorizontal: 4,
  },
  message: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: 'rgba(40, 40, 40, 0.3)',
  },
  messageBlur: {
    width: '100%',
    height: '100%',
  },
  messageTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  divider: {
    width: 0,
    height: 13,
    opacity: 0.3,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  messageActionTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
  },
  sidePlusButton: {
    position: 'absolute',
    top: 200,
    right: 0,
    width: 65,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#282828',
    borderTopLeftRadius: 64,
    borderBottomLeftRadius: 64,
    padding: 8,
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
