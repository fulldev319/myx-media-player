/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState, useMemo, useRef, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Carousel from 'react-native-snap-carousel';
import {socket} from 'screens/Auth';
import {FeedDirectCard} from 'components/cards/FeedDirectCard';
import {PostLayoutType} from 'helper/constants';
import Theme from 'components/common/Theme';
import {apiGetGenres, apiGetSearchGenres} from 'helper/genreHelpers';
import {
  apiGetFollowingFeed,
  apiGetPublicFeed,
  apiGetPublicFeedV2,
  apiGetFollowingFeedV2,
  // apiGetLoadMorePubilcFeedV2,
  // apiGetLoadMoreFollowingFeedV2,
} from 'helper/feedHelpers';
import {DirectEnableIcon, FilterIcon} from 'assets/svg';
import {SearchBar} from 'components/common/SearchBar';
import {Cache} from 'react-native-cache';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TileIcon from 'assets/svg/TileIcon';
import SearchBigIcon from 'assets/svg/SearchBigIcon';
import {useDebouncedCallback} from 'use-debounce';
import {useNavigation} from '@react-navigation/native';
import {Camera} from 'react-native-vision-camera';
import {useAuth} from 'contexts/AuthContext';
import {useTracks} from 'contexts/TrackContext';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const cache = new Cache({
  namespace: 'clioapp',
  policy: {
    maxEntries: 50000, // if unspecified, it can have unlimited entries
    stdTTL: 0, // the standard ttl as number in seconds, default: 0 (unlimited)
  },
  backend: AsyncStorage,
});

const FeedHomePage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {navigate} = useNavigation();
  const {setCurFeedTab} = useAuth();

  const [selectedDisplayMode, setSelectedDisplayMode] = useState<Number>(1); // 0: Grid, 1: Direct
  const [selectedTab, setSelectedTab] = useState<Number>(0); // 0: Public, 1: Following

  const [publicFeedPageNumber, setPublicFeedPageNumber] = useState(1);
  const [followingFeedPageNumber, setFollowingFeedPageNumber] = useState(1);
  const [publicMemoryLastId, setPublicMemoryLastId] = useState(null);
  const [followingLastId, setFollowingLastId] = useState(null);
  const [genreLastId, setGenreLastId] = useState(null);

  const [hasMorePublicFeeds, setHasMorePublicFeeds] = useState(true);
  const [hasMoreFollowingFeeds, setHasMoreFollowingFeeds] = useState(true);
  const [hasMorePublicMemories, setHasMorePublicMemories] = useState(true);
  const [hasMoreFollowingMemories, setHasMoreFollowingMemories] =
    useState(true);
  const [hasMoreGenre, setHasMoreGenre] = useState(true);

  const [arrPublicFeeds, setArrPublicFeeds] = useState([]);
  const [arrPublicMemory, setArrPublicMemory] = useState([]);
  const [arrFollowingFeeds, setArrFollowingFeeds] = useState([]);
  const [arrFollowingMemory, setArrFollowingMemory] = useState([]);
  const [arrGenres, setArrGenres] = useState([]);

  const [loadingPublicFeeds, setLoadingPublicFeeds] = useState<Boolean>(false);
  const [loadingFollowingFeeds, setLoadingFollowingFeeds] =
    useState<Boolean>(false);
  const [loadingPublicMemories, setLoadingPublicMemories] =
    useState<Boolean>(false);
  const [loadingFollowingMemories, setLoadingFollowingMemories] =
    useState<Boolean>(false);
  const [loadingGenre, setLoadingGenre] = useState<Boolean>(false);

  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [isOpenedFilterSheet, setIsOpenedFilterSheet] = useState(false);
  const [searchGenreText, setSearchGenreText] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [isFiltering, setIsFiltering] = useState(false);

  const verticalCarouselRef = useRef(null);
  const horizontalCarouselRef = useRef([]);
  const filterActionRef = useRef(null);
  const snapPointsFilterAction = useMemo(() => [500, 500], []);

  const {playTrack} = useTracks();

  useEffect(() => {
    if (
      selectedDisplayMode === 1 &&
      selectedTab === 0 &&
      arrPublicFeeds.length > currentFeedIndex
    ) {
      const song = arrPublicFeeds[currentFeedIndex].song;
      playTrack(song);
    }
  }, [currentFeedIndex, arrPublicFeeds, selectedTab, selectedDisplayMode]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (
      selectedDisplayMode === 1 &&
      selectedTab === 0 &&
      arrPublicFeeds.length > currentFeedIndex
    ) {
      if (event.nextTrack === undefined) {
        if (arrPublicFeeds.length > currentFeedIndex + 1) {
          verticalCarouselRef.current.snapToNext();
        } else {
          verticalCarouselRef.current.snapToItem(0);
        }
      }
    }
  });

  useEffect(() => {
    loadData();
    // detectNewFeeds();
  }, [selectedTab, selectedDisplayMode]);

  const detectNewFeeds = () => {
    socket.on('Created new feed', () => {
      loadData();
    });
  };

  useEffect(() => {
    setCurFeedTab('Feed');
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission !== 'authorized') {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission !== 'authorized') {
        navigation.goBack();
      }
    }
  };

  const loadData = () => {
    if (selectedDisplayMode === 0) {
      if (selectedTab === 0) {
        loadPublicMemories();
      } else {
        loadFollowingMemories();
      }
    } else {
      if (selectedTab === 0) {
        debouncedLoadPublicFeeds();
      } else {
        debouncedLoadFollowingFeeds();
      }
    }
  };

  useEffect(() => {
    if (isOpenedFilterSheet) {
      setArrGenres([]);
      setHasMoreGenre(true);
      setLoadingGenre(false);
      setGenreLastId(null);
      debouncedLoadGenres();
    } else {
      if (isFiltering) {
        if (selectedTab === 0) {
          setHasMorePublicFeeds(true);
          setPublicFeedPageNumber(1);
          setArrPublicFeeds([]);
          debouncedLoadPublicFeeds();
        } else {
          setHasMoreFollowingFeeds(true);
          setFollowingFeedPageNumber(1);
          setArrFollowingFeeds([]);
          debouncedLoadFollowingFeeds();
        }
      }
    }
  }, [isOpenedFilterSheet, searchGenreText]);

  const loadGenres = async () => {
    if (!hasMoreGenre || loadingGenre) {
      return;
    }

    try {
      setLoadingGenre(true);
      let res = null;
      if (searchGenreText) {
        res = await apiGetSearchGenres(searchGenreText, genreLastId);
      } else {
        res = await apiGetGenres(genreLastId);
      }
      if (res.success) {
        setHasMoreGenre(res.hasMore);
        setGenreLastId(res.lastId);
        if (res.data && res.data.length > 0) {
          setArrGenres(prev => [...prev, ...res.data]);
        }
      }
    } catch (error) {
      console.log('genres error: ', error);
    } finally {
      setLoadingGenre(false);
    }
  };
  const debouncedLoadGenres = useDebouncedCallback(loadGenres, 100);

  const handleGenreFilterChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedFilterSheet(false);
    } else {
      setIsOpenedFilterSheet(true);
    }
  }, []);

  const loadPublicMemories = async () => {
    if (!hasMorePublicMemories || loadingPublicMemories) {
      return;
    }

    try {
      setLoadingPublicMemories(true);
      const params = {
        offset: publicMemoryLastId,
      };
      const res = await apiGetPublicFeed(params);
      if (res.success) {
        setHasMorePublicMemories(res.hasMore);
        setPublicMemoryLastId(res.lastId);
        setArrPublicMemory(prev => [...prev, ...res.data]);
      } else {
        setHasMorePublicMemories(false);
      }
    } catch (error) {
      console.log('public Memory error: ', error);
    } finally {
      setLoadingPublicMemories(false);
    }
  };

  const loadFollowingMemories = async () => {
    if (!hasMoreFollowingMemories || loadingFollowingMemories) {
      return;
    }
    try {
      setLoadingFollowingMemories(true);
      const params = {
        offset: followingLastId,
      };
      const res = await apiGetFollowingFeed(params);

      if (res.success) {
        setHasMoreFollowingMemories(res.hasMore);
        setFollowingLastId(res.lastId);
        setArrFollowingMemory(prev => [...prev, ...res.data]);
      } else {
        setHasMoreFollowingMemories(false);
      }
    } catch (error) {
      console.log('following feed error: ', error);
    } finally {
      setLoadingFollowingMemories(false);
    }
  };

  const loadPublicFeeds = async () => {
    if (!hasMorePublicFeeds || loadingFollowingFeeds) {
      return;
    }

    const cachedPublicFeeds = await cache.get('public_feeds');
    const cachedPublicFeedsPageNumber = await cache.get(
      'public_feeds_pageNumber',
    );

    if (
      !isFiltering &&
      cachedPublicFeeds &&
      parseInt(cachedPublicFeedsPageNumber) === publicFeedPageNumber
    ) {
      setArrPublicFeeds(prev => [...prev, ...cachedPublicFeeds]);
      setPublicFeedPageNumber(publicFeedPageNumber + 1);
    } else {
      try {
        setLoadingPublicFeeds(true);
        const params = {
          pageNumber: publicFeedPageNumber,
          genres: selectedGenres,
        };
        const res = await apiGetPublicFeedV2(params);
        if (res.success) {
          setHasMorePublicFeeds(res.hasMore);
          setPublicFeedPageNumber(publicFeedPageNumber + 1);
          if (res.feed && res.feed.length > 0) {
            setArrPublicFeeds(prev => [...prev, ...res.feed]);
          }
        } else {
          setHasMorePublicFeeds(false);
        }
      } catch (error) {
        console.log('public feed error: ', error);
      } finally {
        setLoadingPublicFeeds(false);
        setIsFiltering(false);
      }
    }
  };
  const debouncedLoadPublicFeeds = useDebouncedCallback(loadPublicFeeds, 100);

  const loadFollowingFeeds = async () => {
    if (!hasMoreFollowingFeeds || loadingFollowingFeeds) {
      return;
    }

    const cachedFollowingFeeds = await cache.get('following_feeds');
    const cachedFollowingFeedsPageNumber = await cache.get(
      'following_feeds_pageNumber',
    );

    if (
      !isFiltering &&
      cachedFollowingFeeds &&
      parseInt(cachedFollowingFeedsPageNumber) === followingFeedPageNumber
    ) {
      setArrFollowingFeeds(prev => [...prev, ...cachedFollowingFeeds]);
      setFollowingFeedPageNumber(followingFeedPageNumber + 1);
    } else {
      try {
        setLoadingFollowingFeeds(true);
        const params = {
          pageNumber: followingFeedPageNumber,
          genres: selectedGenres,
        };
        const res = await apiGetFollowingFeedV2(params);
        if (res.success) {
          setHasMoreFollowingFeeds(res.hasMore);
          setFollowingFeedPageNumber(followingFeedPageNumber + 1);
          setArrFollowingFeeds(prev => [...prev, ...res.feed]);
        } else {
          setHasMoreFollowingFeeds(false);
        }
      } catch (error) {
        console.log('following feed error: ', error);
      } finally {
        setLoadingFollowingFeeds(false);
        setIsFiltering(false);
      }
    }
  };
  const debouncedLoadFollowingFeeds = useDebouncedCallback(
    loadFollowingFeeds,
    100,
  );

  const onDetail = itemData => {
    navigation.navigate('FeedDetailPage', {feedId: itemData.id});
  };

  const onSelectGenres = genre => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(item => item !== genre));
    } else {
      setSelectedGenres(prev => [...prev, genre]);
    }
  };

  const onSlideHorizontalNext = slideIndex => {
    console.log({slideIndex});
    horizontalCarouselRef.current[slideIndex].snapToNext();
  };

  const onSlideHorizontalPrev = slideIndex => {
    console.log({slideIndex});
    horizontalCarouselRef.current[slideIndex].snapToPrev();
  };

  const renderFilterAction = () => {
    return (
      <BottomSheetModal
        ref={filterActionRef}
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
        snapPoints={snapPointsFilterAction}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleGenreFilterChanges}>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 24,
              paddingRight: 32,
              marginTop: 16,
            }}>
            <Text style={{fontSize: 16, fontWeight: '500', color: '#fff'}}>
              Filter Feed by Music Genres
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearchGenreText('');
                setSelectedGenres([]);
                setIsOpenedFilterSheet(false);
                filterActionRef.current?.close();
                setIsFiltering(true);
              }}>
              <Text style={{fontSize: 12, fontWeight: '500', color: '#FF6651'}}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 16,
              marginBottom: 16,
              paddingLeft: 24,
              paddingRight: 32,
            }}>
            <SearchBar
              value={searchGenreText}
              txtPlaceholder="Search here..."
              onChangedText={val => setSearchGenreText(val)}
            />
          </View>
          <BottomSheetScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                debouncedLoadGenres();
              }
            }}>
            <View style={{flexWrap: 'wrap', flexDirection: 'row', padding: 8}}>
              {arrGenres && arrGenres.length > 0 ? (
                arrGenres.map((item, _) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => onSelectGenres(item)}
                    style={{
                      width: '43%',
                      margin: 6,
                      backgroundColor: selectedGenres.includes(item)
                        ? 'rgba(255, 102, 81, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 24,
                      marginLeft: 12,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: selectedGenres.includes(item)
                          ? '#FF6651'
                          : '#fff',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : loadingGenre ? (
                <View
                  style={{width: '100%', alignItems: 'center', marginTop: 32}}>
                  <ActivityIndicator size="large" color="#777777" />
                </View>
              ) : (
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text
                    style={{fontSize: 12, fontWeight: '500', color: '#fff'}}>
                    No Genres
                  </Text>
                </View>
              )}
            </View>
          </BottomSheetScrollView>
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              width: '100%',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsOpenedFilterSheet(false);
                filterActionRef.current?.close();
                setIsFiltering(true);
              }}
              style={{
                width: '80%',
                backgroundColor: '#FF6651',
                borderRadius: 40,
                alignItems: 'center',
                padding: 20,
              }}>
              <Text style={{fontSize: 14, fontWeight: '500', color: '#fff'}}>
                Apply Filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.displayTypesView}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setSelectedTab(0)}
              style={
                selectedTab === 0 ? styles.selectedTab : styles.defaultTab
              }>
              <Text
                style={
                  selectedTab === 0
                    ? styles.selectedTabText
                    : styles.defaultTabText
                }>
                Public
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab(1)}
              style={
                selectedTab === 1 ? styles.selectedTab : styles.defaultTab
              }>
              <Text
                style={
                  selectedTab === 1
                    ? styles.selectedTabText
                    : styles.defaultTabText
                }>
                Following
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.displayTypeItem}
              onPress={() =>
                setSelectedDisplayMode(prev => (prev === 1 ? 0 : 1))
              }>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 42,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {selectedDisplayMode === 0 ? (
                  <TileIcon clicked />
                ) : (
                  <DirectEnableIcon />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.displayTypeItem}
              onPress={() => {
                setIsOpenedFilterSheet(true);
                filterActionRef.current?.present();
              }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 42,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                {selectedGenres.length > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      backgroundColor: '#FF6651',
                      width: 16,
                      height: 16,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 9, color: '#fff'}}>
                      {selectedGenres.length}
                    </Text>
                  </View>
                )}
                <FilterIcon />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.displayTypeItem}
              onPress={() => navigate('ExplorePage')}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 42,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <SearchBigIcon />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const firstPublicCol = useMemo(
    () => arrPublicMemory.filter((feed, index) => index % 2 === 0),
    [arrPublicMemory],
  );
  const secondPublicCol = useMemo(
    () => arrPublicMemory.filter((feed, index) => index % 2 === 1),
    [arrPublicMemory],
  );

  const firstFollowingCol = useMemo(
    () => arrFollowingMemory.filter((feed, index) => index % 2 === 0),
    [arrFollowingMemory],
  );
  const secondFollowingCol = useMemo(
    () => arrFollowingMemory.filter((feed, index) => index % 2 === 1),
    [arrFollowingMemory],
  );

  const renderFollowingBody = () => {
    return (
      <ScrollView
        style={styles.memoryBody}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadFollowingMemories();
          }
        }}
        scrollEventThrottle={500}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginRight: 16}}>
              {firstFollowingCol.map(item => (
                <FeedDirectCard
                  type={PostLayoutType.Small}
                  data={item}
                  key={item.id}
                  isPublic={selectedTab !== 0}
                  onClick={() => onDetail(item)}
                />
              ))}
            </View>
            <View style={{flex: 1}}>
              {secondFollowingCol.map(item => (
                <FeedDirectCard
                  type={PostLayoutType.Small}
                  data={item}
                  key={item.id}
                  isPublic={selectedTab !== 0}
                  onClick={() => onDetail(item)}
                />
              ))}
            </View>
          </View>
          {loadingFollowingMemories && (
            <View style={{marginTop: 32}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderPublicBody = () => {
    return (
      <ScrollView
        style={styles.memoryBody}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadPublicMemories();
          }
        }}
        scrollEventThrottle={500}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginRight: 16}}>
              {firstPublicCol.map(item => (
                <FeedDirectCard
                  type={PostLayoutType.Small}
                  data={item}
                  key={item.id}
                  isPublic={selectedTab !== 0}
                  onClick={() => onDetail(item)}
                />
              ))}
            </View>
            <View style={{flex: 1}}>
              {secondPublicCol.map(item => (
                <FeedDirectCard
                  type={PostLayoutType.Small}
                  data={item}
                  key={item.id}
                  isPublic={selectedTab !== 0}
                  onClick={() => onDetail(item)}
                />
              ))}
            </View>
          </View>
          {loadingPublicMemories && (
            <View style={{marginTop: 32}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const carouselScrollVertical = async idx => {
    setCurrentFeedIndex(idx);
    if (selectedTab === 0) {
      // const res = await apiGetLoadMorePubilcFeedV2({
      //   offset:
      //     arrPublicFeeds[idx + 1].memories[
      //       arrPublicFeeds[idx + 1].memories.length - 1
      //     ].id,
      //   trackId: arrPublicFeeds[idx + 1].song.id,
      // });
      // if (res.success) {
      //   arrPublicFeeds[idx + 1].memories = [
      //     ...arrPublicFeeds[idx + 1].memories,
      //     ...res.memories,
      //   ];
      //   setArrPublicFeeds([...arrPublicFeeds]);
      // }

      if (idx === arrPublicFeeds.length - 3) {
        debouncedLoadPublicFeeds();
      }
    } else {
      // const res = await apiGetLoadMoreFollowingFeedV2({
      //   offset:
      //     arrFollowingFeeds[idx + 1].memories[
      //       arrFollowingFeeds[idx + 1].memories.length - 1
      //     ].id,
      //   trackId: arrFollowingFeeds[idx + 1].song.id,
      // });
      // if (res.success) {
      //   arrFollowingFeeds[idx + 1].memories = [
      //     ...arrFollowingFeeds[idx + 1].memories,
      //     ...res.memories,
      //   ];
      //   setArrFollowingFeeds([...arrFollowingFeeds]);
      // }

      if (idx === arrFollowingFeeds.length - 3) {
        debouncedLoadFollowingFeeds();
      }
    }
  };

  const carouselScrollHorizontal = async idx => {
    setCurrentMemoryIndex(idx);
    // if (selectedTab === 0) {
    //   if (idx === arrPublicFeeds[currentFeedIndex].memories.length - 3) {
    //     const res = await apiGetLoadMorePubilcFeedV2({
    //       offset:
    //         arrPublicFeeds[currentFeedIndex].memories[
    //           arrPublicFeeds[currentFeedIndex].memories.length - 1
    //         ].id,
    //       trackId: arrPublicFeeds[currentFeedIndex].song.id,
    //     });
    //     if (res.success) {
    //       arrPublicFeeds[currentFeedIndex].memories = [
    //         ...arrPublicFeeds[currentFeedIndex].memories,
    //         ...res.memories,
    //       ];
    //       setArrPublicFeeds([...arrPublicFeeds]);
    //     }
    //   }
    // } else {
    //   if (idx === arrFollowingFeeds[currentFeedIndex].memories.length - 3) {
    //     const res = await apiGetLoadMoreFollowingFeedV2({
    //       offset:
    //         arrFollowingFeeds[currentFeedIndex].memories[
    //           arrFollowingFeeds[currentFeedIndex].memories.length - 1
    //         ].id,
    //       trackId: arrFollowingFeeds[currentFeedIndex].song.id,
    //     });
    //     if (res.success) {
    //       arrFollowingFeeds[currentFeedIndex].memories = [
    //         ...arrFollowingFeeds[currentFeedIndex].memories,
    //         ...res.memories,
    //       ];
    //       setArrFollowingFeeds([...arrFollowingFeeds]);
    //     }
    //   }
    // }
  };

  return (
    <View style={styles.body}>
      {renderHeader()}
      {selectedDisplayMode === 1 ? (
        <Carousel
          layout={'default'}
          ref={verticalCarouselRef}
          data={selectedTab === 0 ? arrPublicFeeds : arrFollowingFeeds}
          renderItem={songItem => {
            return (
              <View>
                <Carousel
                  layout={'default'}
                  ref={c =>
                    (horizontalCarouselRef.current = [
                      ...horizontalCarouselRef.current,
                      c,
                    ])
                  }
                  data={songItem.item.memories}
                  renderItem={memoryItem => {
                    return (
                      <FeedDirectCard
                        slideIndex={songItem.index}
                        type={PostLayoutType.Large}
                        data={memoryItem.item}
                        songData={songItem.item.song}
                        // onClick={onDetail}
                        isPublic={selectedTab === 0}
                        onSlideNext={onSlideHorizontalNext}
                        onSlidePrev={onSlideHorizontalPrev}
                        key={songItem.item.id}
                      />
                    );
                  }}
                  sliderWidth={Theme.width}
                  itemWidth={Theme.width}
                  activeSlideAlignment={'center'}
                  loop={true}
                  onSnapToItem={carouselScrollHorizontal}
                />
              </View>
            );
          }}
          sliderWidth={Theme.width}
          sliderHeight={Theme.height}
          itemWidth={Theme.width}
          itemHeight={Theme.height}
          vertical={true}
          activeSlideAlignment={'center'}
          onSnapToItem={carouselScrollVertical}
        />
      ) : (
        <>{selectedTab === 0 ? renderPublicBody() : renderFollowingBody()}</>
      )}
      {renderFilterAction()}
    </View>
  );
};

export default FeedHomePage;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#000000',
  },
  memoryBody: {
    flex: 1,
    backgroundColor: '#000000',
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  displayTypesView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 8,
  },
  displayTypeItem: {
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  defaultTab: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  selectedTab: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 16,
    marginLeft: 16,
  },
  defaultTabText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  selectedTabText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#fff',
  },
});
