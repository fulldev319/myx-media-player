import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';
import {DarkBorderBackIcon, PlayIcon} from 'assets/svg';
import {TrendingMusicCard} from 'components/cards/TrendMusicCard';
import * as Progress from 'react-native-progress';
import {MUSIC_BRANCH, Track, useTracks} from 'contexts/TrackContext';
import {MiniMusicPlayer} from 'screens/MusicPlayer/MiniMusicPlayer';
import {CommonSkeleton} from 'components/common/Skeleton';
import {apiGetGenreArtists, apiGetGenreTracks} from 'helper/genreHelpers';
import {TrendingArtistCard} from 'components/cards/TrendingArtistCard';
import {apiFollowArtist, apiUnFollowArtist} from 'helper/artistHelper';

export const GenresPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {genres} = route.params!;
  const {
    curTrack,
    showPlayer,
    togglePlayer,
    playTrack,
    playlistId,
    playTrackList,
  } = useTracks();
  const [arrMusic, setArrMusic] = useState([]);
  const [arrArtist, setArrArtist] = useState([]);
  const [arrFollowedArtists, setArrFollowedArtists] = useState([]);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  useEffect(() => {
    loadArtists();
    loadTracks();
  }, []);

  const loadArtists = async () => {
    setIsLoadingArtists(true);
    const res = await apiGetGenreArtists(genres);

    if (res.success) {
      setArrArtist(res.data);
      const followedUsers = res.data.filter(
        (item, index) => item.isFollowed === true,
      );
      setArrFollowedArtists(followedUsers);
    }

    setIsLoadingArtists(false);
  };

  const loadTracks = async () => {
    setIsLoadingArtists(true);
    const res = await apiGetGenreTracks(genres);

    if (res.success) {
      setArrMusic(res.data);
    }

    setIsLoadingArtists(false);
  };

  useEffect(() => {
    if (
      arrMusic &&
      arrMusic.length > 0 &&
      playlistId &&
      playlistId === MUSIC_BRANCH.TRENED_MUSIC
    ) {
      playTrackList(arrMusic, undefined, MUSIC_BRANCH.TRENED_MUSIC);
    }
  }, [arrMusic]);

  const togglePlay = (track: Track) => {
    if (curTrack?.id === track?.id) {
      togglePlayer();
    } else if (
      track &&
      playlistId &&
      playlistId === MUSIC_BRANCH.TRENED_MUSIC
    ) {
      playTrack(track);
    } else {
      playTrackList(arrMusic, track?.id, MUSIC_BRANCH.TRENED_MUSIC);
    }
  };

  const goToTrendingMusic = () => {
    navigation.navigate('TrendingMusicPage');
  };

  const goToPopluarArtists = () => {
    navigation.navigate('PopularArtistsPage');
  };

  const onGoToArtist = artistInfo => {
    navigation.navigate('ArtistPage', {artistId: artistInfo.id});
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

  return (
    <View style={styles.root}>
      <ScrollView>
        <Image
          source={require('./../../assets/images/trending_bg.png')}
          style={styles.backgroundImage}
          resizeMode={'stretch'}
        />
        <Image
          source={require('./../../assets/images/trending_light_bg.png')}
          style={styles.backgroundLight}
          resizeMode={'stretch'}
        />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <DarkBorderBackIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{genres}</Text>
        <View style={styles.divider} />
        <View>
          <View style={styles.subContainer}>
            <Text style={styles.subTitle}>Top artists</Text>
            <TouchableOpacity
              onPress={() => {
                goToPopluarArtists();
              }}>
              <Text style={styles.subAction}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.musicList}>
            {isLoadingArtists ? (
              <CommonSkeleton />
            ) : (
              <FlatList
                data={arrArtist}
                horizontal
                style={{marginTop: 20}}
                renderItem={itemData => {
                  const isFollowing = arrFollowedArtists.filter(
                    (followedItem, index) =>
                      itemData.item.id === followedItem.id,
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
        </View>
        <View>
          <View style={styles.subContainer}>
            <Text style={styles.subTitle}>Top music</Text>
            <TouchableOpacity
              onPress={() => {
                goToTrendingMusic();
              }}>
              <Text style={styles.subAction}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.musicList}>
            <FlatList
              data={arrMusic.length < 100 ? arrMusic : arrMusic.slice(0, 99)}
              renderItem={itemData => {
                return (
                  <TrendingMusicCard
                    data={itemData}
                    togglePlay={() => togglePlay(itemData.item)}
                  />
                );
              }}
              keyExtractor={(item, index) => `music-${item?.id}-${index}`}
            />
            {isLoadingArtists && (
              <View style={{height: 100, marginTop: -30}}>
                <CommonSkeleton />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      {curTrack && showPlayer && (
        <View style={styles.miniPlayer}>
          <MiniMusicPlayer />
        </View>
      )}
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
    height: '100%',
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 450,
  },
  backgroundLight: {position: 'absolute', top: 0, right: 0, height: 450},
  header: {
    marginVertical: 20,
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 28,
    color: '#FFFFFF',
    padding: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 30,
    marginHorizontal: 20,
  },
  musicList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  playAllContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  playAll: {
    backgroundColor: '#FF6651',
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
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  subTitle: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  subAction: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: -3,
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
