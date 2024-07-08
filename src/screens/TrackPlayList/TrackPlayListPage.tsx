import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

import {MiniHeader} from './components/MiniHeader';
import {FullHeader} from './components/FullHeader';
import {MusicTrackCard} from 'components/cards/MusicTrackCard';
import {PlayIcon} from './components/TrackPlayListIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  apiGetPlayList,
  apiGetPlayListTracks,
  apiRemoveTrackFromPlayList,
} from 'helper/trackHelpers';
import {MiniMusicPlayer} from 'screens/MusicPlayer/MiniMusicPlayer';
import {Track, useTracks} from 'contexts/TrackContext';
import {UserCard} from 'components/cards/UserCard';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

type ContextType = {
  translateY: number;
  state: string;
};

export const TrackPlayListPage = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const {params} = useRoute() as any;
  const {navigate} = useNavigation();
  const {playlistId, curTrack, playTrackList, togglePlayer, playTrack} =
    useTracks();

  const [info, setInfo] = useState<any>({trackNumber: 0});
  const [isOwn, setIsOwn] = useState(false);
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [lastId, setLastId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [noSongs, setNosongs] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(70);
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
      marginBottom = withSpring(100);
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
        position: 'absolute',
        opacity: 1,
      };
    }
    return {
      position: 'absolute',
      opacity: opacity,
    };
  });
  const playAllStyle = useAnimatedStyle(() => {
    if (contextState.value === 'down') {
      return {
        display: 'flex',
      };
    }
    return {
      display: 'none',
    };
  });

  const getPlayListInfo = () => {
    apiGetPlayList(params.playlistId).then(res => {
      if (res.success) {
        setInfo(pre => ({...pre, ...res.data}));
        if (res?.data?.creator?.id === user.id) {
          setIsOwn(true);
        } else {
          setIsOwn(false);
        }
      }
    });
  };

  const getPlayListTracks = () => {
    if (!hasMore || loading) {
      return;
    }
    setLoading(true);

    apiGetPlayListTracks(params.playlistId, lastId)
      .then(res => {
        if (res.success) {
          const _trackList = [...trackList, ...res.data];
          setTrackList(_trackList);
          setHasMore(res.hasMore);
          setLastId(res.lastId);
          if (_trackList.length === 0) {
            setNosongs(true);
          }
        } else {
          setHasMore(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleScroll = e => {
    if (!loading && isCloseToBottom(e.nativeEvent)) {
      getPlayListTracks();
    }
  };

  useEffect(() => {
    // playTrackList([]);
    getPlayListInfo();
    getPlayListTracks();
  }, []);

  const togglePlay = (track?: Track) => {
    if (curTrack?.id === track?.id) {
      togglePlayer();
    } else if (track && playlistId && playlistId === info?.id) {
      playTrack(track);
    } else {
      playTrackList(trackList, track?.id, info?.id);
    }
  };

  const toggleAllPlay = () => {
    if (playlistId && playlistId === info?.id) {
      togglePlayer();
    } else {
      playTrackList(trackList, undefined, info?.id);
    }
  };

  useEffect(() => {
    if (playlistId !== info?.id && params.autoPlay) {
      playTrackList(trackList, undefined, info?.id);
    } else if (
      trackList &&
      trackList.length > 0 &&
      playlistId &&
      playlistId === info?.id
    ) {
      playTrackList(trackList, undefined, info?.id);
    }
  }, [trackList]);

  const onDeleteHandle = trackId => {
    console.log('on delete');
    apiRemoveTrackFromPlayList(trackId, params.playlistId).then(res => {
      if (res.success) {
        setTrackList(prev => prev.filter(t => t.id !== trackId));
        getPlayListInfo();
      }
    });
  };

  return (
    <View style={[styles.root]}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={styles.header}>
          <Animated.View style={[{width: '100%'}, upStyle]}>
            <FullHeader
              setHeaderHeight={setHeaderHeight}
              info={info}
              togglePlay={toggleAllPlay}
              playEnable={trackList.length > 0}
            />
          </Animated.View>
          <Animated.View style={[{width: '100%'}, minStyle]}>
            <MiniHeader info={info} />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.content}>
        {trackList.length > 0 && (
          <FlatList
            style={{width: '100%', flex: 1}}
            data={trackList}
            keyExtractor={(item, index) => item.id + index}
            renderItem={itemData => {
              return (
                <MusicTrackCard
                  data={itemData}
                  togglePlay={() => togglePlay(itemData.item)}
                  onDelete={() => {
                    onDeleteHandle(itemData.item.id);
                  }}
                  isOwn={isOwn}
                />
              );
            }}
            onScroll={handleScroll}
            scrollEventThrottle={400}
          />
        )}
        {noSongs && (
          <View style={styles.empty}>
            <Image
              source={require('./../../assets/images/no_friends_icon.png')}
            />
            <Text style={styles.emptyTxt}>No song added yet.</Text>
            <TouchableOpacity
              style={styles.browseMusicBtn}
              onPress={() => {
                navigate('ExplorePage');
              }}>
              <Text style={styles.browseMusicTxt}>Browse Music</Text>
            </TouchableOpacity>
          </View>
        )}
        {loading && (
          <View style={{paddingVertical: 20}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
      </View>
      {curTrack ? (
        <View style={styles.miniPlayer}>
          <MiniMusicPlayer />
        </View>
      ) : (
        <Animated.View style={[styles.playAllContainer, playAllStyle]}>
          <TouchableOpacity style={styles.playAll} onPress={toggleAllPlay}>
            <PlayIcon />
            <Text style={styles.playAllTxt}>Play All</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    // paddingBottom: 120,
  },
  header: {},
  tabs: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderBottomColor: '#212121',
    borderWidth: 1,
    justifyContent: 'space-between',
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
    justifyContent: 'center',
    alignItems: 'center',
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
  playAllContainer: {
    alignItems: 'center',
    marginTop: -30,
  },
  playAll: {
    backgroundColor: 'white',
    borderRadius: 62,
    marginBottom: 27,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 145,
  },
  playAllTxt: {
    marginLeft: 10,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#010101',
  },
  miniPlayer: {
    marginBottom: -20,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 20,
    marginBottom: 28,
  },
  browseMusicBtn: {
    width: 130,
    height: 42,
    backgroundColor: '#FF6651',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  browseMusicTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
  },
});
