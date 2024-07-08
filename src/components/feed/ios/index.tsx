/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Carousel from 'react-native-snap-carousel';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'helper/utils';
import {apiGetMyAudios} from 'helper/userHelpers';
import WheelView from 'components/AudioWheels/WheelView';
import {
  apiGetFictionDebates,
  apiGetFictionTrendingDebates,
  apiGetFictionMyEmoji,
  apiGetFictionTrendingMedias,
} from 'helper/fictionHelper';
import {
  apiGetAllCountries,
  apiGetMyCountries,
  apiGetSearchCountries,
} from 'helper/mapHelper';
import {eventListenDebate} from 'helper/socketHelper';
import {
  ArrowLeftIcon,
  SearchBigIcon,
  FireIcon,
  CitizenIcon,
  HelperIcon,
  PlayBigIcon,
  PauseBigIcon,
} from 'assets/svg';
import {styles} from './index.styles';
import LinearGradient from 'react-native-linear-gradient';
import {MicIcon} from 'screens/thread/assets/svgs';
import {PrimaryButton} from 'components/common';
import {
  CreateNewPostModal,
  WheelHelperModal,
  CardTrendingCountry,
} from './components';
import {useNavigation} from '@react-navigation/native';
import CardTrendingMedia from './components/CardTrendingMedia';
import {SearchBar} from 'components/common/SearchBar';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {useTracks} from 'contexts/TrackContext';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {ThumbEmolike} from 'components/thread/ThumbEmolike';
import {useDebouncedCallback} from 'use-debounce';

const paddings = [0, 50, 0];

export const GeneralFeedView = ({show, onClose, onCountryDetail}) => {
  const navigation = useNavigation();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [150, 150, SCREEN_HEIGHT, SCREEN_HEIGHT],
    [],
  );
  const {user} = useSelector((state: RootState) => state.auth);
  const {togglePlayer, curTrack, playingStatus, playOneTrack, trackPosition} =
    useTracks();

  const [helperModalVisible, setHelperModalVisible] = useState(false);
  const [createNewPostVisible, setCreateNewPostVisible] = useState(false);

  const [hasMoreDebates, setHasMoreDebates] = useState(true);
  const [loadingDebates, setLoadingDebates] = useState(false);
  const [debatesLastId, setDebatesLastId] = useState(0);
  const [fictionDebateList, setFictionDebateList] = useState([]);

  const [hasMoreTrendingDebates, setHasMoreTrendingDebates] = useState(true);
  const [loadingTrendingDebates, setLoadingTrendingDebates] = useState(false);
  const [trendingDebatesLastId, setTrendingDebatesLastId] = useState(0);
  const [fictionTrendingDebateList, setFictionTrendingDebateList] = useState(
    [],
  );
  const [isVisibleTrendingAudios, setIsVisibleTrendingAudios] = useState(false);

  const [hasMoreCountries, setHasMoreCountries] = useState(true);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [countryLastId, setCountryLastId] = useState(0);
  const [arrCountry, setArrCountry] = useState([]);
  const [isVisibleTrendingCountries, setIsVisibleTrendingCountries] =
    useState(false);

  const [hasMoreMedias, setHasMoreMedias] = useState(true);
  const [loadingMedias, setLoadingMedias] = useState(false);
  const [mediaLastId, setMediaLastId] = useState(0);
  const [arrTrendingMedias, setArrTrendingMedias] = useState([]);
  const [isVisibleTrendingMedias, setIsVisibleTrendingMedias] = useState(false);

  const [hasMoreEmoji, setHasMoreEmoji] = useState(true);
  const [loadingEmoji, setLoadingEmoji] = useState(false);
  const [emojiLastId, setEmojiLastId] = useState(null);
  const [emojiList, setEmojiList] = useState([]);
  const [myCountries, setMyCountries] = useState([]);
  const [myAudios, setMyAudios] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [isVisibleSearchContainer, setIsVisibleSearchContainer] =
    useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [prevTrackPosition, setPrevTrackPosition] = useState(0);

  const indicatorTop = useSharedValue(0);
  const customIndicatorStyle = useAnimatedStyle(() => {
    let marginTop = indicatorTop.value;

    return {
      marginTop: marginTop,
    };
  });

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();

      // load data
      loadData();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  useEffect(() => {
    if (playingStatus === 'pause') {
      setIsPlayed(false);
    }
  }, [playingStatus]);

  useEffect(() => {
    if (playingStatus === 'playing' && trackPosition - prevTrackPosition > 5) {
      setPrevTrackPosition(trackPosition);
      eventListenDebate({
        comment: curTrack?.id,
        user: user?.id,
        time: trackPosition,
      });
    }
  }, [trackPosition]);

  useEffect(() => {
    if (isVisibleSearchContainer) {
      loadSearchedCountries();
    }
  }, [searchText]);

  const loadData = () => {
    debouncedLoadFictionDebates();
    loadFictionMyEmolikes();
    loadMyCountries();
    loadMyAudios();
    debouncedLoadFictionTrendingDebates();
    loadTrendingCountries();
    loadTrendingMedias();
  };

  const loadSearchedCountries = async () => {
    if (!hasMoreCountries || loadingCountries) {
      return;
    }

    try {
      setLoadingCountries(true);
      const res = await apiGetSearchCountries(searchText, 10, countryLastId);
      if (res.success) {
        setHasMoreCountries(res.hasMore);
        setCountryLastId(res.lastId);
        setArrCountry([...res.data]);
      } else {
        setHasMoreDebates(false);
      }
    } catch (error) {
      console.log('searched countries error: ', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadFictionDebates = async () => {
    if (!hasMoreDebates || loadingDebates) {
      return;
    }

    try {
      setLoadingDebates(true);
      const params = {
        offset: debatesLastId,
      };
      const res = await apiGetFictionDebates(params);
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
  const debouncedLoadFictionDebates = useDebouncedCallback(
    loadFictionDebates,
    100,
  );

  const loadFictionTrendingDebates = async () => {
    if (!hasMoreTrendingDebates || loadingTrendingDebates) {
      return;
    }

    try {
      setLoadingTrendingDebates(true);
      const params = {
        offset: trendingDebatesLastId,
      };
      const res = await apiGetFictionTrendingDebates(params);
      if (res.success) {
        setHasMoreTrendingDebates(res.hasMore);
        setTrendingDebatesLastId(res.lastId);
        setFictionTrendingDebateList(prev => [...prev, ...res.data]);
      } else {
        setHasMoreTrendingDebates(false);
      }
    } catch (error) {
      console.log('fiction trending debates error: ', error);
    } finally {
      setLoadingTrendingDebates(false);
    }
  };
  const debouncedLoadFictionTrendingDebates = useDebouncedCallback(
    loadFictionTrendingDebates,
    100,
  );

  const loadFictionMyEmolikes = async () => {
    if (hasMoreEmoji && !loadingEmoji) {
      setLoadingEmoji(true);
      const params = {
        offset: emojiLastId,
      };

      const res = await apiGetFictionMyEmoji(params);
      if (res.success) {
        setHasMoreEmoji(res.hasMore);
        setEmojiLastId(res.lastId);
        setEmojiList(prev => [...prev, ...res.data]);
      }

      setLoadingEmoji(false);
    }
  };

  const loadMyCountries = async () => {
    let lastId = 0;
    const res = await apiGetMyCountries(10, lastId);

    if (res.success) {
      setMyCountries([...res.data]);
      lastId = res.lastId;
    }
  };

  const loadMyAudios = async () => {
    let lastId = 0;
    const res = await apiGetMyAudios(10, lastId, 'all', user.id);
    if (res.success) {
      setMyAudios([...res.data]);
      lastId = res.lastId;
    }
  };

  const loadTrendingCountries = async () => {
    if (!hasMoreCountries || loadingCountries) {
      return;
    }

    try {
      setLoadingCountries(true);
      const res = await apiGetAllCountries(10, countryLastId, true);
      if (res.success) {
        setHasMoreCountries(res.hasMore);
        setCountryLastId(res.lastId);
        setArrCountry(prev => [...prev, ...res.data]);
      } else {
        setHasMoreDebates(false);
      }
    } catch (error) {
      console.log('trending countries error: ', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadTrendingMedias = async () => {
    if (!hasMoreMedias || loadingMedias) {
      return;
    }

    try {
      setLoadingMedias(true);
      const params = {
        offset: mediaLastId,
      };
      const res = await apiGetFictionTrendingMedias(params);

      if (res.success) {
        setHasMoreMedias(res.hasMore);
        setMediaLastId(res.lastId);
        setArrTrendingMedias(prev => [...prev, ...res.data]);
      } else {
        setLoadingMedias(false);
      }
    } catch (error) {
      console.log('trending medias error: ', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    } else if (index === 1) {
      indicatorTop.value = withSpring(0);
    } else if (index === 3) {
      indicatorTop.value = withSpring(40);
    }
  }, []);

  const onChangedText = val => {
    setSearchText(val);
  };

  const handleSearch = () => {
    setIsVisibleSearchContainer(true);
    setHasMoreCountries(true);
    setLoadingCountries(false);
    setCountryLastId(0);
  };

  const handleBackCountry = () => {
    if (isVisibleSearchContainer) {
      setIsVisibleSearchContainer(false);
    } else {
      setIsVisibleTrendingCountries(false);
    }
  };

  const handlePlayer = audio => {
    setIsPlayed(!isPlayed);
    if (String(curTrack?.id) === String(audio.id)) {
      togglePlayer();
    } else {
      if (audio && audio.url) {
        playOneTrack(
          {
            id: String(audio.id),
            image: '',
            title: audio.keywords,
            artists: [''],
            description: '',
            url: audio.url,
            previewUrl: audio.url,
          },
          audio.id,
          false,
        );
      }
    }
  };

  const handleHeaderAudioCard = audio => {
    if (audio.is_debate === 0) {
      navigation.navigate('SubThreadPage', {
        id: audio.id,
        url: audio.url,
      });
    } else {
      navigation.navigate('ThreadPage', {id: audio.id});
    }
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={{marginEnd: 40}}
          onPress={() => {
            // navigate('CreateDebatPage', {});
          }}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Feed</Text>
        <TouchableOpacity onPress={() => {}}>
          <SearchBigIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderAudioTrend = () => {
    return (
      <View style={styles.myTrendingContainer}>
        <Text style={styles.titleCenter}>Your Audio is Trending!</Text>
        <View style={styles.myTrendingSubContainer}>
          <Carousel
            layout={'default'}
            data={myCountries}
            sliderWidth={SCREEN_WIDTH}
            itemWidth={320}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            firstItem={Math.floor(myCountries.length / 2)}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => onCountryDetail(item)}
                  style={styles.trendHot}
                  key={index}>
                  <View style={styles.flexRow}>
                    <View style={styles.trendHotIcon}>
                      <FireIcon />
                    </View>
                    <Text style={styles.subTitle1}>{item.name}</Text>
                  </View>
                  <View style={styles.flexCenterRow}>
                    <CitizenIcon />
                    <Text style={styles.citizen}>{item.population}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <View style={styles.spaceView} />
          <Carousel
            layout={'default'}
            data={myAudios}
            sliderWidth={SCREEN_WIDTH}
            itemWidth={320}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            firstItem={Math.floor(myAudios.length / 2)}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.trendAudio}
                  key={index}
                  onPress={() => handleHeaderAudioCard(item)}>
                  <View style={styles.flexCenterRow}>
                    <WheelView
                      data={{
                        inner_image: user.image.includes('http')
                          ? user.image
                          : '',
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
                      hideTopic
                      hideLabel
                      hideDuration
                    />
                    <View>
                      <Text style={styles.trendAudioTitle}>
                        {Array.isArray(item.keywords)
                          ? item.keywords[0]
                          : item.keywords.split(',').length > 0
                          ? item.keywords.split(',')[0]
                          : item.keywords}
                      </Text>
                      <View style={styles.flexCenterRow}>
                        <Text style={styles.trendNumber}>{item.views}</Text>
                        <Text style={styles.trendView}>Views</Text>
                      </View>
                      {/* <View style={styles.flexCenterRow}>
                        <Text style={styles.trendAudioPercent}>+14%</Text>
                        <Text style={styles.trendAudioLastweek}>
                          from last week
                        </Text>
                      </View> */}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.playAudioBtn}
                    onPress={() => handlePlayer(item)}>
                    {isPlayed ? <PauseBigIcon /> : <PlayBigIcon />}
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
          />
          {emojiList.length > 0 && (
            <TouchableOpacity
              style={styles.trendInfo}
              onPress={() => {
                navigation.navigate('EmolikePage', {
                  id: user.id,
                });
              }}>
              <View style={styles.trendEmolike}>
                <View style={styles.trendEmolikeCounts}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('EmolikePage', {
                        id: user.id,
                      })
                    }>
                    <Text style={styles.subTitle3}>
                      Emolikes ({emojiList.length})
                    </Text>
                  </TouchableOpacity>
                  {emojiList.length > 9 && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('EmolikePage', {
                          id: user.id,
                        })
                      }>
                      <Text style={styles.subTitle5}>See All</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView
                  horizontal
                  contentContainerStyle={{paddingHorizontal: 16}}>
                  <ThumbEmolike
                    data={emojiList}
                    itemSize={24}
                    maxSize={9}
                    showPlus={false}
                    showMoreView={false}
                    onAddEmoji={() => {}}
                  />
                </ScrollView>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderTrendingAudio = () => {
    return (
      <View style={styles.trendingAudioContainer}>
        <View style={styles.flexRow}>
          <View style={styles.flexCenterRow}>
            <Text style={styles.subTitle6}>Trending Audios</Text>
            <TouchableOpacity
              style={styles.helperContainer}
              onPress={() => setHelperModalVisible(true)}>
              <HelperIcon />
            </TouchableOpacity>
          </View>
          {fictionTrendingDebateList && fictionTrendingDebateList.length > 5 && (
            <TouchableOpacity onPress={() => setIsVisibleTrendingAudios(true)}>
              <Text style={[styles.subTitle5, {fontSize: 10}]}>
                {'See All >'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal style={{marginTop: 8}}>
          {loadingTrendingDebates ? (
            <View style={{marginTop: 16}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          ) : fictionTrendingDebateList &&
            fictionTrendingDebateList.length > 0 ? (
            fictionTrendingDebateList.slice(0, 5).map((item, index) => (
              <TouchableOpacity
                style={styles.wheelView}
                onPress={() => {
                  navigation.navigate('ThreadPage', {id: item.id});
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
            ))
          ) : (
            <View style={styles.flexCenterRow}>
              <Text style={styles.noData}>No Data</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderNewMoments = () => {
    return (
      <View style={styles.trendingAudioContainer}>
        <View style={styles.flexRow}>
          <Text style={styles.subTitle6}>New Medias Each Seconds</Text>
          {arrTrendingMedias.length > 8 && (
            <TouchableOpacity onPress={() => setIsVisibleTrendingMedias(true)}>
              <Text style={[styles.subTitle5, {fontSize: 10}]}>
                {'See All >'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal style={{marginTop: 16}}>
          {arrTrendingMedias.slice(0, 8).map((item, index) => (
            <CardTrendingMedia data={item} key={index} />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderJoinCountries = () => {
    return (
      <View style={styles.trendingAudioContainer}>
        <View style={styles.flexRow}>
          <Text style={styles.subTitle6}>Join New Countries</Text>
          {arrCountry.length > 5 && (
            <TouchableOpacity
              onPress={() => setIsVisibleTrendingCountries(true)}>
              <Text style={[styles.subTitle5, {fontSize: 10}]}>
                {'See All >'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal style={{marginTop: 16}}>
          {loadingCountries ? (
            <View style={{marginTop: 16}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          ) : (
            arrCountry
              .slice(0, 5)
              .map((item, index) => (
                <CardTrendingCountry key={index} item={item} />
              ))
          )}
        </ScrollView>
      </View>
    );
  };

  const renderAroundWorlds = () => {
    return (
      <View style={styles.aroundWorldContainer}>
        <Text style={styles.subTitle6}>Around the Worlds</Text>
        <View style={styles.aroundWorldMainContainer}>
          {fictionDebateList && fictionDebateList.length > 0 ? (
            fictionDebateList.map((item, index) => (
              <View
                style={[
                  styles.countryWheel,
                  {
                    paddingTop: paddings[index % 3],
                  },
                ]}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ThreadPage', {id: item.id})
                  }>
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
            ))
          ) : (
            <View style={styles.flexCenterRow}>
              <Text style={styles.noData}>No Data</Text>
            </View>
          )}
        </View>
        {loadingDebates && (
          <View style={{marginTop: 16}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
      </View>
    );
  };

  const renderAllTrendingAudios = () => {
    return (
      <View style={styles.aroundWorldContainer}>
        <TouchableOpacity
          style={styles.trendingAudioBackBtn}
          onPress={() => setIsVisibleTrendingAudios(false)}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={[styles.subTitle6, {textAlign: 'center'}]}>
          Trending Audios
        </Text>
        <View style={styles.aroundWorldMainContainer}>
          {fictionTrendingDebateList && fictionTrendingDebateList.length > 0 ? (
            fictionTrendingDebateList.map((item, index) => (
              <View
                style={[
                  styles.countryWheel,
                  {
                    paddingTop: paddings[index % 3],
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ThreadPage', {id: item.id});
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
            ))
          ) : (
            <View style={styles.flexCenterRow}>
              <Text style={styles.noData}>No Data</Text>
            </View>
          )}
        </View>
        {loadingTrendingDebates && (
          <View style={{marginTop: 16}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
      </View>
    );
  };

  const renderAllTrendingCountries = () => {
    return (
      <View style={styles.aroundWorldContainer}>
        <View style={styles.allCountriesMainContainer}>
          <TouchableOpacity onPress={handleBackCountry}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          {isVisibleSearchContainer ? (
            <View style={{width: 280}}>
              <SearchBar
                value={searchText}
                txtPlaceholder="Search..."
                onChangedText={onChangedText}
              />
            </View>
          ) : (
            <>
              <Text style={styles.subTitle6}>Join New Countries!</Text>
              <TouchableOpacity onPress={handleSearch}>
                <SearchBigIcon />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.aroundWorldMainContainer}>
          {loadingCountries ? (
            <View style={{marginTop: 16}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          ) : (
            arrCountry.map((item, index) => (
              <CardTrendingCountry key={index} item={item} />
            ))
          )}
        </View>
      </View>
    );
  };

  const renderAllTrendingMedias = () => {
    return (
      <View style={styles.aroundWorldContainer}>
        <TouchableOpacity
          style={styles.trendingAudioBackBtn}
          onPress={() => setIsVisibleTrendingMedias(false)}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={[styles.subTitle6, {textAlign: 'center'}]}>
          New Medias
        </Text>
        <View style={styles.aroundWorldMainContainer}>
          {arrTrendingMedias.map((item, index) => (
            <CardTrendingMedia key={index} data={item} isBigCard />
          ))}
        </View>
      </View>
    );
  };

  const renderBackground = () => {
    return (
      <View>
        <View style={styles.blueBackground}>
          <Image source={require('assets/images/FeedRedBackground.png')} />
        </View>
        <View style={styles.redBackground}>
          <Image source={require('assets/images/FeedBlueBackground.png')} />
        </View>
      </View>
    );
  };

  const renderCreateButton = () => {
    return (
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.01)', '#171717']}
        style={styles.createPostBtnWrapper}>
        <PrimaryButton
          onPress={() => setCreateNewPostVisible(true)}
          icon={<MicIcon />}
          label="Create New Post"
        />
      </LinearGradient>
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={[styles.indicator, customIndicatorStyle]}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={false}
      enableDismissOnClose={true}
      onChange={handleSheetChanges}
      style={{marginBottom: 100}}>
      <View style={[StyleSheet.absoluteFill]}>
        <BottomSheetScrollView
          style={styles.scrollContainer}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              if (isVisibleTrendingAudios) {
                debouncedLoadFictionTrendingDebates();
              } else {
                debouncedLoadFictionDebates();
              }
            }
          }}
          scrollEventThrottle={500}>
          {isVisibleTrendingAudios ? (
            renderAllTrendingAudios()
          ) : isVisibleTrendingCountries ? (
            renderAllTrendingCountries()
          ) : isVisibleTrendingMedias ? (
            renderAllTrendingMedias()
          ) : (
            <>
              {renderBackground()}
              {renderHeader()}
              {renderAudioTrend()}
              {renderTrendingAudio()}
              {arrTrendingMedias &&
                arrTrendingMedias.length >= 3 &&
                renderNewMoments()}
              {arrCountry && arrCountry.length >= 3 && renderJoinCountries()}
              {renderAroundWorlds()}
            </>
          )}
        </BottomSheetScrollView>
        {renderCreateButton()}
      </View>
      {helperModalVisible && (
        <WheelHelperModal
          open={helperModalVisible}
          onClose={() => setHelperModalVisible(false)}
        />
      )}
      {createNewPostVisible && (
        <CreateNewPostModal
          onDetail={id => {
            sheetRef.current?.close();
            onClose();

            setTimeout(() => {
              navigation.navigate('ThreadPage', {id});
            }, 500);
          }}
          visible={createNewPostVisible}
          hideModal={() => setCreateNewPostVisible(false)}
        />
      )}
    </BottomSheetModal>
  );
};
