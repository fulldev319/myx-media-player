/* eslint-disable react-native/no-inline-styles */
import {StackScreenProps} from '@react-navigation/stack';
import * as Progress from 'react-native-progress';
import {PopularArtistCard} from 'components/cards/PopularArtistCard';
import {TrendingMusicCard} from 'components/cards/TrendMusicCard';
import {TrendingPlayListCard} from 'components/cards/TrendingPlayListCard';
import {TagCard} from 'components/cards/TagCard';
import {MusicCard} from 'components/cards/MusicCard';
import {SearchBar} from 'components/SearchBar';
import {ScrollView} from 'native-base';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  apiGetTrendingPlaylist,
  apiGetTrendingMusic,
  apiGetTopArtist,
  apiGetSearchTracks,
  apiGetRecentSearch,
  apiRemoveRecentSerch,
} from 'helper/trackHelpers';
import {apiGetTrendingPeople, apiGetSearchUsers} from 'helper/userHelpers';
import {apiGetSearchTags} from 'helper/memoryHelpers';
import {styles} from './index.styles';
import {MagicSearchBtn} from './MagicSearchBtn';
import appAction from 'redux/app/actions';
import {useDispatch, useSelector} from 'react-redux';
import {UserCard} from 'components/cards/UserCard';
import {ClockIcon} from 'assets/svg/clock';
import {TrashIcon} from 'assets/svg/trash';
import {DarkBorderBackIcon} from 'assets/svg';
import {apiGetSearchPlaylists} from 'helper/playListDaoHelpers';
import {HorizontalPlaylistCard} from 'components/cards/HorizontalPlaylistCard';
import {apiGetGenres} from 'helper/genreHelpers';
import {MUSIC_BRANCH, Track, useTracks} from 'contexts/TrackContext';
import {MiniMusicPlayer} from 'screens/MusicPlayer/MiniMusicPlayer';
import {apiFollowArtist, apiUnFollowArtist} from 'helper/artistHelper';
import {RootState} from 'redux/interfaces';
import {CommonSkeleton} from 'components/common/Skeleton';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const ExplorePage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [queryStarted, setQueryStarted] = useState(false);
  const [searchCategory, setSearchCategory] = useState('music');
  const [loading, setLoading] = useState(false);
  const [arrTrendingArtist, setArrTrendingArtist] = useState([]);
  const [arrTrendingMusic, setArrTrendingMusic] = useState([]);
  const [arrTrendingPlaylist, setArrTrendingPlaylist] = useState([]);
  const [arrFollowedArtists, setArrFollowedArtists] = useState([]);
  const [arrTrendingPeople, setArrTrendingPeople] = useState([]);
  const [arrGenres, setArrGenres] = useState([]);
  const [arrSelectedGenres, setArrSelectedGenres] = useState([]);
  const [searchedTracks, setSearchedTracks] = useState([]);
  const [searchedTags, setSearchedTags] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedPlaylists, setSearchedPlaylists] = useState([]);
  const [searchedTracksCount, setSearchedTracksCount] = useState(0);
  const [searchedUsersCount, setSearchedUsersCount] = useState(0);
  const [searchedPlaylistsCount, setSearchedPlaylistsCount] = useState(0);
  const [lastSearchTrack, setLastSearchTrack] = useState('');
  const [searchTrackHasMore, setSearchTrackHasMore] = useState(true);
  const [lastSearchPlaylist, setLastSearchPlaylist] = useState('');
  const [searchPlaylistHasMore, setSearchPlaylistHasMore] = useState(true);
  const [lastSearchPeople, setLastSearchPeople] = useState('');
  const [searchPeopleHasMore, setSearchPeopleHasMore] = useState(true);
  const [arrRecentSearch, setArrRecentSearch] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [isLoadingPeople, setIsLoadingPeople] = useState(false);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [isLoadingArtist, setIsLoadingArtist] = useState(false);

  const dispatch = useDispatch();

  const loadGenres = async () => {
    const res = await apiGetGenres(null, 10);

    if (res.success) {
      setArrGenres(res.data);
    }
  };

  const loadTrendingMusic = async () => {
    setIsLoadingMusic(true);
    const res = await apiGetTrendingMusic(null);

    if (res.success) {
      setArrTrendingMusic(res.data);
    }
    setIsLoadingMusic(false);
  };

  const loadTrendingPlaylist = async () => {
    setIsLoadingPlaylist(true);
    const res = await apiGetTrendingPlaylist();

    if (res.success) {
      setArrTrendingPlaylist(res.data);
    }
    setIsLoadingPlaylist(false);
  };

  const loadTrendingPeople = async () => {
    setIsLoadingPeople(true);
    const res = await apiGetTrendingPeople();
    if (res.success) {
      setArrTrendingPeople(res.data);
    }
    setIsLoadingPeople(false);
  };

  const loadTopArtist = async () => {
    setIsLoadingArtist(true);
    const res = await apiGetTopArtist();

    if (res.success) {
      setArrTrendingArtist(res.data);
      const followedUsers = res.data.filter(
        (item, index) => item.isFollowed === true,
      );
      setArrFollowedArtists(followedUsers);
    }
    setIsLoadingArtist(false);
  };

  const loadRecentSearch = async () => {
    const res = await apiGetRecentSearch();

    if (res.success) {
      setArrRecentSearch(res.data);
    }
  };

  const removeRecentSearch = async searchText => {
    const res = await apiRemoveRecentSerch(searchText);
    if (res.success) {
      const newRecentSearch = arrRecentSearch.filter(
        item => item !== searchText,
      );

      setArrRecentSearch(newRecentSearch);
    }
  };

  const searchMusic = async (searchString: string, lastId?: any) => {
    const res = await apiGetSearchTracks(searchString, lastId);
    if (res.success) {
      if (lastId) {
        setSearchedTracks([...searchedTracks, ...res.data]);
      } else {
        setSearchedTracks(res.data);
      }
      setSearchTrackHasMore(res.hasMore);
      setLastSearchTrack(res.lastId);
      setSearchedTracksCount(
        res.count >= 1000
          ? Math.round((res.count * 10) / 1000) / 10 + 'k'
          : res.count,
      );
    }
  };

  const searchUser = async (searchString: string, lastId?: any) => {
    const res = await apiGetSearchUsers(searchString, lastId);
    if (res.success) {
      const filteredUser = res.data.map((item, index) => {
        item.image = item.profileImage;
        return item;
      });

      if (lastId) {
        setSearchedUsers([...searchedUsers, ...filteredUser]);
      } else {
        setSearchedUsers(filteredUser);
      }
      setSearchPeopleHasMore(res.hasMore);
      setLastSearchPeople(res.lastId);
      setSearchedUsersCount(
        res.count >= 1000
          ? Math.round((res.count * 10) / 1000) / 10 + 'k'
          : res.count,
      );
    }
  };

  const searchTag = async (searchString: string) => {
    const res = await apiGetSearchTags(searchString);
    if (res.success) {
      setSearchedTags(res.data);
    }
  };

  const searchPlaylist = async (searchString: string, lastId?: any) => {
    const res = await apiGetSearchPlaylists(searchString, lastId);
    if (res.success) {
      if (lastId) {
        setSearchedPlaylists([...searchedPlaylists, ...res.data]);
      } else {
        setSearchedPlaylists(res.data);
      }
      setSearchPlaylistHasMore(res.hasMore);
      setLastSearchPlaylist(res.lastId);
      setSearchedPlaylistsCount(
        res.count >= 1000
          ? Math.round((res.count * 10) / 1000) / 10 + 'k'
          : res.count,
      );
    }
  };

  useEffect(() => {
    loadGenres();
    loadTrendingPlaylist();
    loadTrendingMusic();
    loadTrendingPeople();
    loadTopArtist();
  }, []);

  const goToTrendingPlaylistPage = () => {
    navigation.navigate('TrendingPlaylistPage');
  };

  const goToTrendingMusic = () => {
    navigation.navigate('TrendingMusicPage');
  };

  const goToTrendingPeople = () => {
    navigation.navigate('TrendingPeoplePage');
  };

  const goToPopluarArtists = () => {
    navigation.navigate('PopularArtistsPage');
  };

  const goToPeopleProfile = peopleId => {
    if (peopleId === user.id) {
      navigation.navigate('Profile', {userId: peopleId});
    } else {
      navigation.navigate('OtherProfilePage', {userId: peopleId});
    }
  };

  const goToGenres = genres => {
    navigation.navigate('GenresPage', {genres});
  };

  const startMagicSearch = () => {
    dispatch(appAction.showMagicSearchDialog(''));
  };

  const stopMagicSearch = () => {
    dispatch(appAction.dismissMagicSearchDialog());
  };

  const startSearch = () => {
    setQueryStarted(true);
    searchMusic(searchText);
    searchUser(searchText);
    searchTag(searchText);
    searchPlaylist(searchText);
  };

  const closeSearch = () => {
    setQueryStarted(false);
    setSearching(false);
    setSearchText('');
  };

  const recentSearch = searchItem => {
    setQueryStarted(true);
    searchMusic(searchItem);
    searchUser(searchItem);
    searchTag(searchItem);
    searchPlaylist(searchItem);
  };

  const loadMore = () => {
    if (searchCategory === 'tag') {
      return;
    }
    if (searchCategory === 'music') {
      if (!searchTrackHasMore) {
        return;
      }
      searchMusic(searchText, lastSearchTrack);
    } else if (searchCategory === 'playlist') {
      if (!searchPlaylistHasMore) {
        return;
      }
      searchPlaylist(searchText, lastSearchPlaylist);
    } else if (searchCategory === 'user') {
      if (!searchPeopleHasMore) {
        return;
      }
      searchUser(searchText, lastSearchPeople);
    }
  };

  const onSelected = async item => {
    setArrSelectedGenres(prev => [...prev, ...[item]]);
  };

  const onDeselect = async selectedItem => {
    const filteredArr = arrSelectedGenres.filter(
      (item, index) => item !== selectedItem,
    );

    setArrSelectedGenres(filteredArr);
  };

  const onFollowArtist = async artist => {
    setShowLoading(true);
    const res = await apiFollowArtist(artist.id);
    if (res.success) {
      setArrFollowedArtists(prev => [...prev, ...[artist]]);
    }
    setShowLoading(false);
  };

  const onUnfollowArtist = async artist => {
    setShowLoading(true);
    const res = await apiUnFollowArtist(artist.id);

    if (res.success) {
      const filteredArr = arrFollowedArtists.filter(
        (item, index) => item !== artist,
      );
      setArrFollowedArtists(filteredArr);
    }
    setShowLoading(false);
  };

  const onGoToArtist = artistId => {
    navigation.navigate('ArtistPage', {artistId});
  };

  const renderGenres = () => {
    return (
      <ScrollView
        horizontal
        style={{
          width: '100%',
        }}
        showsHorizontalScrollIndicator={false}>
        {arrGenres.map((item, index) => {
          const isSelected = arrSelectedGenres.filter(
            (selectedItem, index) => item === selectedItem,
          );

          return (
            <TouchableOpacity
              style={{
                height: 34,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
                borderRadius: 16,
                backgroundColor:
                  isSelected.length > 0
                    ? 'rgba(255, 255, 255, 0.6)'
                    : 'rgba(255, 255, 255, 0.15)',
                marginEnd: 7,
              }}
              onPress={() => goToGenres(item)}>
              <Text style={styles.genreText}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const {height} = Dimensions.get('window');

  const {
    curTrack,
    showPlayer,
    togglePlayer,
    playlistId,
    playTrack,
    playTrackList,
  } = useTracks();

  const toggleTrendPlay = (track: Track) => {
    if (curTrack?.id === track?.id) {
      togglePlayer();
    } else if (
      track &&
      playlistId &&
      playlistId === MUSIC_BRANCH.TRENED_MUSIC
    ) {
      playTrack(track);
    } else {
      playTrackList(arrTrendingMusic, track?.id, MUSIC_BRANCH.TRENED_MUSIC);
    }
  };

  const toggleSearchPlay = (track: Track) => {
    const curPlayId = `${MUSIC_BRANCH.SEARCH_TRACKS}-${searchText}`;
    if (curTrack?.id === track?.id) {
      togglePlayer();
    } else if (track && playlistId && playlistId === curPlayId) {
      playTrack(track);
    } else {
      playTrackList(searchedTracks, track?.id, curPlayId);
    }
  };

  useEffect(() => {
    const curPlayId = `${MUSIC_BRANCH.SEARCH_TRACKS}-${searchText}`;
    if (
      searchedTracks &&
      searchedTracks.length > 0 &&
      playlistId &&
      playlistId === curPlayId
    ) {
      playTrackList(searchedTracks, undefined, curPlayId);
    }
  }, [searchedTracks]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.mainContainer}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            if (searching && queryStarted) {
              loadMore();
            }
          }
        }}
        scrollEventThrottle={500}>
        <View>
          <SearchBar
            value={searchText}
            txtPlaceholder="Search..."
            onChangedText={text => {
              loadRecentSearch();
              setSearchText(text);
            }}
            isSearching={searching}
            closeSearch={closeSearch}
            startSearch={startSearch}
            startSearching={() => setSearching(true)}
          />
          {!searching && <MagicSearchBtn startMagicSearch={startMagicSearch} />}
          {!searching && renderGenres()}
        </View>
        {searching &&
          (queryStarted ? (
            <ScrollView style={styles.container}>
              <ScrollView horizontal style={{marginVertical: 18}}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => setSearchCategory('music')}>
                    <Text
                      style={
                        searchCategory === 'music'
                          ? styles.categorySelected
                          : styles.category
                      }>
                      {`Musics(${searchedTracksCount})`}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSearchCategory('playlist')}>
                    <Text
                      style={
                        searchCategory === 'playlist'
                          ? styles.categorySelected
                          : styles.category
                      }>
                      {`Playlists(${searchedPlaylistsCount})`}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSearchCategory('user')}>
                    <Text
                      style={
                        searchCategory === 'user'
                          ? styles.categorySelected
                          : styles.category
                      }>
                      {`Users(${searchedUsersCount})`}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSearchCategory('tag')}>
                    <Text
                      style={
                        searchCategory === 'tag'
                          ? styles.categorySelected
                          : styles.category
                      }>{`Tags(${searchedTags.length})`}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              {loading ? (
                <View
                  style={{
                    height: height - 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Progress.Circle
                    size={40}
                    indeterminate={true}
                    borderWidth={2}
                    borderColor={'#FF6651'}
                    thickness={10}
                  />
                </View>
              ) : searchCategory === 'music' ? (
                <FlatList
                  data={searchedTracks}
                  renderItem={itemData => {
                    return (
                      <MusicCard
                        data={itemData}
                        key={itemData.index}
                        togglePlay={() => toggleSearchPlay(itemData.item)}
                      />
                    );
                  }}
                  keyExtractor={(item, index) =>
                    `searchedTracks-${item?.id}-${index}`
                  }
                />
              ) : searchCategory === 'playlist' ? (
                <FlatList
                  data={searchedPlaylists}
                  renderItem={itemData => (
                    <HorizontalPlaylistCard
                      data={itemData}
                      key={itemData.index}
                    />
                  )}
                  keyExtractor={(item, index) =>
                    `searchedPlaylist-${item?.id}-${index}`
                  }
                />
              ) : searchCategory === 'user' ? (
                <FlatList
                  data={searchedUsers}
                  renderItem={itemData => {
                    const isFollowing = arrFollowedArtists.filter(
                      (followedItem, index) =>
                        itemData.item.id === followedItem.id,
                    );

                    return (
                      <PopularArtistCard
                        data={itemData}
                        isFollowing={isFollowing.length > 0}
                        onFollow={artist => onFollowArtist(artist)}
                        onUnFollow={artist => onUnfollowArtist(artist)}
                        onGoToPeopleProfile={goToPeopleProfile}
                        key={itemData.index}
                      />
                    );
                  }}
                  keyExtractor={(item, index) =>
                    `searchedUsers-${item?.id}-${index}`
                  }
                />
              ) : (
                <FlatList
                  data={searchedTags}
                  renderItem={itemData => {
                    return <TagCard data={itemData} key={itemData.index} />;
                  }}
                />
              )}
            </ScrollView>
          ) : (
            <ScrollView style={styles.container}>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>Recent search</Text>
              </View>
              <FlatList
                data={arrRecentSearch}
                renderItem={itemData => (
                  <TouchableOpacity
                    style={styles.recentSearchKeyword}
                    key={itemData.item}
                    onPress={() => {
                      recentSearch(itemData.item);
                      setSearching(true);
                    }}>
                    <ClockIcon style={{opacity: 0.4}} />
                    <Text style={styles.recentSearchKeywordText}>
                      {itemData.item}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeRecentSearch(itemData.item)}>
                      <TrashIcon style={{opacity: 0.6}} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => `keyword-${item?.id}-${index}`}
              />
            </ScrollView>
          ))}
        {!searching && (
          <View style={styles.container}>
            <View>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>Trending playlists</Text>
                <TouchableOpacity onPress={() => goToTrendingPlaylistPage()}>
                  <Text style={styles.subAction}>See all</Text>
                </TouchableOpacity>
              </View>
              {isLoadingPlaylist ? (
                <CommonSkeleton />
              ) : (
                <ScrollView horizontal>
                  <View style={styles.horizontalLayout}>
                    {arrTrendingPlaylist.map((item, index) => (
                      <TrendingPlayListCard
                        data={item}
                        key={index}
                        style={{marginRight: 16}}
                      />
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
            <View>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>Trending people</Text>
                <TouchableOpacity onPress={() => goToTrendingPeople()}>
                  <Text style={styles.subAction}>See all</Text>
                </TouchableOpacity>
              </View>
              {isLoadingPeople ? (
                <CommonSkeleton />
              ) : (
                <ScrollView horizontal>
                  <View style={[styles.horizontalLayout, {marginBottom: 0}]}>
                    {arrTrendingPeople.map((user, index) => (
                      <UserCard
                        user={user}
                        key={index}
                        style={{marginEnd: 15}}
                        onPress={() => {
                          goToPeopleProfile(user.userId);
                        }}
                      />
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
            <View>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>Trending musics</Text>
                <TouchableOpacity onPress={() => goToTrendingMusic()}>
                  <Text style={styles.subAction}>See all</Text>
                </TouchableOpacity>
              </View>
              {isLoadingMusic ? (
                <CommonSkeleton />
              ) : (
                <FlatList
                  data={arrTrendingMusic}
                  style={{maxHeight: 500, paddingEnd: 20}}
                  renderItem={itemData => {
                    return (
                      <TrendingMusicCard
                        data={itemData}
                        togglePlay={() => toggleTrendPlay(itemData.item)}
                      />
                    );
                  }}
                  keyExtractor={(item, index) =>
                    `trendMusic-${item?.id}-${index}`
                  }
                />
              )}
            </View>
            <View style={{paddingBottom: 40}}>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>Popular artists</Text>
                <TouchableOpacity onPress={() => goToPopluarArtists()}>
                  <Text style={styles.subAction}>See all</Text>
                </TouchableOpacity>
              </View>
              {isLoadingArtist ? (
                <CommonSkeleton />
              ) : (
                <FlatList
                  data={arrTrendingArtist}
                  style={{marginTop: 20}}
                  renderItem={itemData => {
                    const isFollowing = arrFollowedArtists.filter(
                      (followedItem, index) =>
                        itemData.item.id === followedItem.id,
                    );

                    return (
                      <PopularArtistCard
                        data={itemData}
                        isFollowing={isFollowing.length > 0}
                        onFollow={artist => onFollowArtist(artist)}
                        onUnFollow={artist => onUnfollowArtist(artist)}
                        onGoToPeopleProfile={onGoToArtist}
                        key={itemData.index}
                      />
                    );
                  }}
                  keyExtractor={(item, index) =>
                    `trendArtist-${item?.id}-${index}`
                  }
                />
              )}
            </View>
          </View>
        )}
      </ScrollView>
      {curTrack && showPlayer && (
        <View style={styles.miniPlayer}>
          <MiniMusicPlayer />
        </View>
      )}
    </View>
  );
};

export default ExplorePage;
