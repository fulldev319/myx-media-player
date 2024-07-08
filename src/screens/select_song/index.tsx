import {StackScreenProps} from '@react-navigation/stack';
import {DarkBorderBackIcon} from 'assets/svg';
import {SearchBar} from 'components/common/SearchBar';
import {MainStackParams} from 'navigators';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TaggedSheet from '@gorhom/bottom-sheet';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SelectSongCard} from './SelectSongCard';
import LinearGradient from 'react-native-linear-gradient';
import {convertTimeFormat} from 'helper/utils';
import {
  apiGetAllTracks,
  apiGetRecentTracks,
  apiGetSavedTracks,
} from 'helper/trackHelpers';
import {
  MUSIC_BRANCH,
  PlayingStatus,
  Track,
  useTracks,
} from 'contexts/TrackContext';
import {
  MiniNextPlayIcon,
  MiniPauseIcon,
  MiniPlayIcon,
  MiniPrevPlayIcon,
  WaveProgress,
} from 'screens/MusicPlayer/components/musicPlayerIcons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {apiGetUserRecentListening} from 'helper/userHelpers';

export const SelectSongPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {navigate} = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'recent' | 'saved'>(
    'all',
  );
  const taggedSheetRef = useRef<TaggedSheet>(null);
  const snapPoints = useMemo(() => [250, 250], []);

  const [hasMoreAllTracks, setHasMoreAllTracks] = useState(true);
  const [hasMoreRecentTracks, setHasMoreRecentTracks] = useState(true);
  const [hasMoreSavedTracks, setHasMoreSavedTracks] = useState(true);
  const [arrAllTrack, setArrAllTrack] = useState([]);
  const [arrRecentTrack, setArrRecentTrack] = useState([]);
  const [arrSavedTrack, setArrSavedTrack] = useState([]);
  const [lastIdAll, setLastIdAll] = useState(null);
  const [lastIdRecent, setLastIdRecent] = useState(null);
  const [lastIdSaved, setLastIdSaved] = useState(null);

  const [isLoadingAll, setIsLoadingAll] = useState(false);

  useEffect(() => {
    loadRecentSong();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const loadMoreSongList = async searchValue => {
    console.log('--- called recent', selectedTab);
    switch (selectedTab) {
      case 'recent':
        break;
      case 'saved':
        setIsLoadingAll(true);
        if (hasMoreSavedTracks && !isLoadingAll) {
          const res = await apiGetSavedTracks(searchValue, lastIdSaved);

          if (res.success) {
            setHasMoreSavedTracks(res.hasMore);
            setLastIdSaved(res.lastId);
            setArrSavedTrack(prev => [...prev, ...res.data]);
          }
        }
        setIsLoadingAll(false);
        break;
      default:
        if (hasMoreAllTracks && !isLoadingAll) {
          setIsLoadingAll(true);
          const res = await apiGetAllTracks(searchValue, lastIdAll);

          if (res.success) {
            setHasMoreAllTracks(res.hasMore);
            setLastIdAll(res.lastId);
            setArrAllTrack(prev => [...prev, ...res.data]);
          }
          setIsLoadingAll(false);
        }
        break;
    }
  };

  const loadRecentSong = async () => {
    if (hasMoreRecentTracks && !isLoadingAll) {
      setIsLoadingAll(true);
      const res = await apiGetUserRecentListening({
        userId: user.id,
        offset: lastIdRecent,
      });

      if (res.success) {
        setHasMoreRecentTracks(res.hasMore);
        setLastIdRecent(res.lastId);
        setArrRecentTrack(prev => [...prev, ...res.data]);
      }
      setIsLoadingAll(false);
    }
  };

  const loadSearchSongList = async searchValue => {
    switch (selectedTab) {
      case 'recent':
      case 'saved':
        const res2 = await apiGetSavedTracks(searchValue, null);

        if (res2.success) {
          setArrSavedTrack(res2.data);
        }
        break;
      default:
        const res = await apiGetAllTracks(searchValue, null);

        if (res.success) {
          setArrAllTrack(res.data);
        }
        break;
    }
  };

  const onChangedText = val => {
    if (val === '' || searchText === '') {
      setArrSavedTrack([]);
      setArrAllTrack([]);
      setArrRecentTrack([]);
      setHasMoreAllTracks(true);
      setHasMoreRecentTracks(true);
      setHasMoreSavedTracks(true);
      setLastIdSaved(null);
      setLastIdRecent(null);
      setLastIdAll(null);
      loadMoreSongList(val);
    } else {
      setArrSavedTrack([]);
      setArrAllTrack([]);
      setArrRecentTrack([]);
      loadSearchSongList(val);
    }
    setSearchText(val);
  };

  const onChangeTab = tab => {
    setSelectedTab(tab);
    loadMoreSongList(searchText);
  };

  const {
    curTrack,
    playlistId,
    playTrackList,
    playTrack,
    playPrevTrack,
    playNextTrack,
    playingStatus,
    togglePlayer,
    trackDuration,
    trackPosition,
  } = useTracks();

  const progress = useMemo(() => {
    if (trackDuration > 0 && trackDuration >= trackPosition) {
      return (100 * trackPosition) / trackDuration;
    }
    return 0;
  }, [trackDuration, trackPosition]);

  const onSelectedTrack = (track: Track) => {
    setSelectedTrack(track);
    taggedSheetRef.current?.snapToIndex(0);

    if (curTrack?.id === track?.id) {
      togglePlayer();
    } else if (
      track &&
      playlistId &&
      playlistId === MUSIC_BRANCH.SELECT_TRACK
    ) {
      playTrack(track);
    } else {
      playTrackList(arrAllTrack, track?.id, MUSIC_BRANCH.SELECT_TRACK);
    }
  };

  const onGoToAddMemory = () => {
    taggedSheetRef.current?.close();
    navigation.navigate('AddMemoryPage', {songId: selectedTrack.id});
  };

  const renderHeader = () => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <DarkBorderBackIcon />
          </TouchableOpacity>
          <Text style={styles.title}>Select Song</Text>
        </View>
        <SearchBar
          value={searchText}
          txtPlaceholder="Search song..."
          onChangedText={onChangedText}
        />
      </View>
    );
  };

  const renderTab = () => {
    return (
      <View style={styles.tabConatiner}>
        <TouchableOpacity
          style={
            selectedTab === 'all'
              ? styles.selectedTabContainer
              : styles.defaultTabContainer
          }
          onPress={() => onChangeTab('all')}>
          <Text style={styles.tabText}>All Song</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            selectedTab === 'recent'
              ? styles.selectedTabContainer
              : styles.defaultTabContainer,
            {flex: 1, marginHorizontal: 30},
          ]}
          onPress={() => onChangeTab('recent')}>
          <Text style={styles.tabText}>Recent listening</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedTab === 'saved'
              ? styles.selectedTabContainer
              : styles.defaultTabContainer
          }
          onPress={() => onChangeTab('saved')}>
          <Text style={styles.tabText}>Saved Song</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSongList = () => {
    return (
      <View style={styles.songView}>
        <ScrollView
          style={styles.root}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              if (selectedTab === 'recent') {
                loadRecentSong();
              } else {
                loadMoreSongList(searchText);
              }
            }
          }}
          scrollEventThrottle={500}>
          <FlatList
            keyExtractor={(_, index) => index.toString()}
            data={
              selectedTab === 'all'
                ? arrAllTrack
                : selectedTab === 'recent'
                ? arrRecentTrack
                : arrSavedTrack
            }
            renderItem={itemData => {
              return (
                <SelectSongCard
                  data={itemData}
                  key={itemData.index}
                  isSelected={
                    selectedTrack && itemData.item.id === selectedTrack.id
                  }
                  onPress={onSelectedTrack}
                />
              );
            }}
          />
        </ScrollView>
      </View>
    );
  };

  const renderBottomActionView = () => {
    return (
      <TaggedSheet
        ref={taggedSheetRef}
        index={-1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        handleIndicatorStyle={{backgroundColor: 'rgba(255, 255, 255, 0.34)'}}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}>
        {selectedTrack && (
          <View style={[StyleSheet.absoluteFill, {left: 50, right: 50}]}>
            <TouchableOpacity
              style={[styles.playerContainer]}
              onPress={() => {
                navigate('FullMusicPlayer');
              }}>
              <View style={[styles.playerInfo]}>
                <Image
                  source={{uri: selectedTrack.image}}
                  style={styles.playerImage}
                />
                <View style={styles.playerSongInfoContainer}>
                  <Text
                    style={styles.playerTxtName}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {selectedTrack.title}
                  </Text>
                  <Text
                    style={styles.txtDesc}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {selectedTrack.aritsts[0]}
                  </Text>
                </View>
                <Text style={styles.playerTxtDuration}>
                  {convertTimeFormat(selectedTrack.duration)}
                </Text>
              </View>
              <View style={[styles.playerAction]}>
                <WaveProgress style={{marginTop: 13}} progress={progress} />
                <View style={styles.playerControl}>
                  <TouchableOpacity onPress={playPrevTrack}>
                    <MiniPrevPlayIcon />
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
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : playingStatus === PlayingStatus.Playing ? (
                        <MiniPauseIcon />
                      ) : (
                        <MiniPlayIcon />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={playNextTrack}>
                    <MiniNextPlayIcon />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btnSubmit}
                onPress={onGoToAddMemory}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#ff3f3f', '#ff701f']}
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 27,
                    },
                  ]}>
                  <Text style={styles.buttonText}>Submit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TaggedSheet>
    );
  };

  return (
    <View style={styles.root}>
      {renderHeader()}
      {renderTab()}
      {renderSongList()}
      {renderBottomActionView()}
    </View>
  );
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
  },
  container: {
    padding: 20,
  },
  header: {
    marginVertical: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {},
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  tabConatiner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  defaultTabContainer: {
    padding: 10,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  songView: {
    flex: 1,
    marginTop: 20,
  },
  btnContainer: {
    position: 'absolute',
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
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  playerContainer: {
    width: '100%',
  },
  playerInfo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAction: {
    width: '100%',
    alignItems: 'center',
  },
  playerControl: {
    marginTop: 16,
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerImage: {
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  playerSongInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  playerTxtName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playerTxtDuration: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginEnd: 10,
  },
});
