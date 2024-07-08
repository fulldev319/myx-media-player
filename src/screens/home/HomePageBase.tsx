import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import ImageSlider from 'react-native-image-slider';
import {TrendingMusicCard} from 'components/cards/TrendMusicCard';
import {TrendingArtistCard} from 'components/cards/TrendingArtistCard';
import {RecentReleaseCard} from 'components/cards/RecentReleaseCard';
import {SCREEN_WIDTH} from 'helper/utils';
import {
  apiGetTrendingPlaylist,
  apiGetTrendingMusic,
  apiGetRecentRelease,
  apiGetTopArtist,
} from 'helper/trackHelpers';
import {MUSIC_BRANCH, Track, useTracks} from 'contexts/TrackContext';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {apiFollowArtist, apiUnFollowArtist} from 'helper/artistHelper';
import {CommonSkeleton} from 'components/common/Skeleton';

export const HomePageBase = () => {
  const {navigate} = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const [arrTrendingPlayList, setArrTrendingPlayList] = useState([]);
  const [arrTrendingMusic, setArrTrendingMusic] = useState([]);
  const [arrTopArtist, setArrTopArtist] = useState([]);
  const [arrFollowedArtists, setArrFollowedArtists] = useState([]);
  const [arrRecentRelease, setArrRecentRelease] = useState([]);
  const {playlistId, curTrack, playTrackList, playTrack, togglePlayer} =
    useTracks();
  const [showLoading, setShowLoading] = useState(false);

  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  const [isLoadingRelease, setIsLoadingRelease] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    loadTrendingPlayList();
    loadTrendingMusic();
    loadRecentRelease();
    loadTopArtist();
  };

  const loadTrendingMusic = async () => {
    setIsLoadingMusic(true);
    const res = await apiGetTrendingMusic(null);

    if (res.success) {
      setArrTrendingMusic(res.data);
    }

    setIsLoadingMusic(false);
  };

  const loadTrendingPlayList = async () => {
    setIsLoadingPlaylist(true);
    const res = await apiGetTrendingPlaylist();
    if (res.success) {
      setArrTrendingPlayList(res.data);
    }
    setIsLoadingPlaylist(false);
  };

  const loadRecentRelease = async () => {
    setIsLoadingRelease(true);
    const res = await apiGetRecentRelease(null);

    if (res.success) {
      setArrRecentRelease(res.data);
    }
    setIsLoadingRelease(false);
  };

  const loadTopArtist = async () => {
    setIsLoadingArtists(true);
    const res = await apiGetTopArtist();

    if (res.success) {
      setArrTopArtist(res.data);
      const followedUsers = res.data.filter(
        (item, index) => item.isFollowed === true,
      );
      setArrFollowedArtists(followedUsers);
    }
    setIsLoadingArtists(false);
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

  const onGoToTrendingMusic = () => {
    navigate('TrendingMusicPage');
  };

  const onGoToArtist = artistInfo => {
    navigate('ArtistPage', {artistId: artistInfo.id});
  };

  const onGoToPopularArtist = () => {
    navigate('PopularArtistsPage');
  };

  const onGoToRecentRelease = () => {
    navigate('RecentReleasePage');
  };

  const togglePlay = (track: Track, musicBranch: MUSIC_BRANCH) => {
    if (curTrack?.id === track?.id) {
      togglePlayer();
    } else if (track && playlistId && playlistId === musicBranch) {
      playTrack(track);
    } else {
      if (musicBranch === MUSIC_BRANCH.TRENED_MUSIC) {
        playTrackList(arrTrendingMusic, track?.id, musicBranch);
      } else if (musicBranch === MUSIC_BRANCH.RECENT_RELEASE) {
        playTrackList(arrRecentRelease, track?.id, musicBranch);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageSlider
        images={arrTrendingPlayList}
        style={{backgroundColor: 'transparent'}}
        customSlide={({index, item, style, width}) => (
          <TouchableOpacity
            onPress={() => navigate('TrackPlayListPage', {playlistId: item.id})}
            key={index}
            style={[styles.customSlide, {width: width - 40}]}>
            <ImageBackground
              resizeMode="cover"
              source={{uri: item.image}}
              style={styles.customImage}>
              <LinearGradient
                colors={['rgba(0, 0, 0, 0.3)', 'rgba(0,0,0,1)']}
                style={StyleSheet.absoluteFill}
              />
            </ImageBackground>
            <View style={styles.sliderInfoView}>
              <Text style={styles.sliderTitleText}>{item.title}</Text>
              <Text style={styles.sliderSubTitleText}>
                {item?.creator?.username ?? item?.creator?.id}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={{marginTop: 20}}>
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>Trending music</Text>
          <TouchableOpacity
            onPress={() => {
              onGoToTrendingMusic();
            }}>
            <Text style={styles.subAction}>See all</Text>
          </TouchableOpacity>
        </View>
        {isLoadingMusic ? (
          <CommonSkeleton />
        ) : (
          <FlatList
            data={arrTrendingMusic}
            style={{maxHeight: 500}}
            renderItem={itemData => {
              return (
                <TrendingMusicCard
                  data={itemData}
                  togglePlay={() =>
                    togglePlay(itemData.item, MUSIC_BRANCH.TRENED_MUSIC)
                  }
                />
              );
            }}
            keyExtractor={(item, index) => `trendMusic-${item?.id}-${index}`}
          />
        )}
      </View>
      <View style={{marginTop: 20}}>
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>Trending artists</Text>
          <TouchableOpacity
            onPress={() => {
              onGoToPopularArtist();
            }}>
            <Text style={styles.subAction}>See all</Text>
          </TouchableOpacity>
        </View>
        {isLoadingArtists ? (
          <CommonSkeleton />
        ) : (
          <FlatList
            data={arrTopArtist}
            horizontal
            style={{marginTop: 20}}
            renderItem={itemData => {
              const isFollowing = arrFollowedArtists.filter(
                (followedItem, index) => itemData.item.id === followedItem.id,
              );

              return (
                <TrendingArtistCard
                  data={itemData}
                  isFollowing={isFollowing.length > 0}
                  onFollow={artist => onFollowArtist(artist)}
                  onUnFollow={artist => onUnfollowArtist(artist)}
                  onDetail={onGoToArtist}
                />
              );
            }}
            keyExtractor={(item, index) => `topArtist-${item?.id}-${index}`}
          />
        )}
      </View>
      <View style={{marginTop: 30}}>
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>Recent releases</Text>
          <TouchableOpacity
            onPress={() => {
              onGoToRecentRelease();
            }}>
            <Text style={styles.subAction}>See all</Text>
          </TouchableOpacity>
        </View>
        {isLoadingRelease ? (
          <CommonSkeleton />
        ) : (
          <FlatList
            data={arrRecentRelease}
            style={{maxHeight: 500}}
            renderItem={itemData => {
              return (
                <RecentReleaseCard
                  data={itemData}
                  togglePlay={() =>
                    togglePlay(itemData.item, MUSIC_BRANCH.RECENT_RELEASE)
                  }
                />
              );
            }}
            keyExtractor={(item, index) => `recentRelease-${item?.id}-${index}`}
          />
        )}
      </View>
      <View style={{marginBottom: 50}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subTitle: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  subAction: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 3,
    width: 15,
    height: 15,
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    opacity: 1,
    color: 'red',
  },
  customSlide: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    overflow: 'hidden',
  },
  customImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 40,
  },
  sliderInfoView: {
    position: 'absolute',
    bottom: 40,
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
  },
  sliderTitleText: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  sliderSubTitleText: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
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
