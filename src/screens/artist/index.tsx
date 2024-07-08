import {StackScreenProps} from '@react-navigation/stack';
import {ArrowBackIcon} from 'native-base';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  FlatList,
} from 'react-native';
import {BackIcon} from 'screens/TrackPlayList/components/TrackPlayListIcons';
import LinearGradient from 'react-native-linear-gradient';
import {FeaturedPlaylistCard} from './FeaturedPlaylistCard';
import {TopSongCard} from './TopSongCard';
import {RecentReleaseCard} from './RecentReleaseCard';
import {
  apiGetArtistInfo,
  apiGetArtistPlaylist,
  apiGetArtistRecentTracks,
  apiGetArtistTracks,
} from 'helper/artistHelper';
import {MUSIC_BRANCH, Track, useTracks} from 'contexts/TrackContext';
import {MiniMusicPlayer} from 'screens/MusicPlayer/MiniMusicPlayer';
import {CommonSkeleton} from 'components/common/Skeleton';

const ArtistPage = ({route, navigation}: StackScreenProps<MainStackParams>) => {
  const {artistId} = route.params!;
  const [detail, setDetail] = useState(null);
  const [arrPlaylist, setArrPlaylist] = useState([]);
  const [arrTracks, setArrTracks] = useState([]);
  const [arrAllTracks, setArrAllTracks] = useState([]);
  const [hasMoreAllTracks, setHasMoreAllTracks] = useState([]);
  const [lastIdAllTracks, setLastIdAllTracks] = useState(null);
  const [isLoaidng, setIsLoading] = useState(false);

  useEffect(() => {
    loadArtistInfo();
    loadPlaylist();
    loadTracks();
  }, []);

  const loadArtistInfo = async () => {
    const res = await apiGetArtistInfo(artistId);

    if (res.success) {
      setDetail(res.data);
    }
  };

  const loadPlaylist = async () => {
    const res = await apiGetArtistPlaylist(artistId, null, 5);

    if (res.success) {
      setArrPlaylist(res.data);
    }
  };

  const loadTracks = async () => {
    if (hasMoreAllTracks && !isLoaidng) {
      setIsLoading(true);
      const res = await apiGetArtistTracks(artistId, lastIdAllTracks, 10);

      if (res.success) {
        if (lastIdAllTracks === null) {
          setArrTracks(res.data);
        }

        setHasMoreAllTracks(res.hasMore);
        setLastIdAllTracks(res.lastId);
        setArrAllTracks(prev => [...prev, ...res.data]);
      }

      setIsLoading(false);
    }
  };

  const {curTrack, showPlayer, playTrack, playTrackList, playlistId} =
    useTracks();

  const togglePlay = (track?: Track) => {
    if (curTrack?.id === track?.id) {
      // togglePlayer();
    } else if (
      track &&
      playlistId &&
      playlistId === `${MUSIC_BRANCH.TOP_TRACKS}-${artistId}`
    ) {
      playTrack(track);
    } else {
      playTrackList(
        arrTracks,
        track?.id,
        `${MUSIC_BRANCH.TOP_TRACKS}-${artistId}`,
      );
    }
  };

  console.log({arrAllTracks});
  if (detail) {
    return (
      <View style={styles.root}>
        <ScrollView
          style={styles.root}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              loadTracks();
            }
          }}
          scrollEventThrottle={500}>
          <Image
            source={{
              uri: detail.image,
            }}
            style={styles.backgroundImage}
            resizeMode={'cover'}
          />
          <LinearGradient
            colors={['rgba(255, 112, 31, 0.4)', 'rgba(255, 112, 31, 0.4)']}
            style={styles.headerFilter}
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.3)', 'rgba(0,0,0,1)']}
            style={styles.headerFilter}
          />
          <Image
            source={require('./../../assets/images/trending_light_bg.png')}
            style={styles.backgroundLight}
            resizeMode={'stretch'}
          />
          <View style={styles.body}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <BackIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.artistMarkContainer}>
              <Text style={styles.artistMarkTitle}>ARTIST</Text>
            </View>
            <Text style={styles.title}>{detail.name}</Text>
            {/* <Text style={styles.listenerTxt}>4344,2345 monthly listener</Text> */}

            <View style={{marginTop: 40}}>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>Featured Playlists</Text>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.subAction}>See all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={arrPlaylist}
                style={{marginTop: 16}}
                horizontal
                renderItem={itemData => {
                  return (
                    <FeaturedPlaylistCard
                      data={itemData}
                      key={`play_list_${itemData.index}`}
                    />
                  );
                }}
                keyExtractor={(item, index) => `playlist-${item?.id}-${index}`}
              />
            </View>
            <View style={{marginTop: 40}}>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>Top Song of All Time</Text>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.subAction}>See all</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal style={{marginTop: -5}}>
                <View>
                  <View style={styles.topSongRow}>
                    {arrTracks
                      .filter((itemData, index) => index % 2 === 0)
                      .map((itemData, index) => (
                        <TopSongCard
                          data={itemData}
                          index={index}
                          numRow={1}
                          togglePlay={() => togglePlay(itemData)}
                          key={`top_song_index_${itemData.index}`}
                        />
                      ))}
                  </View>
                  <View style={styles.topSongRow}>
                    {arrTracks
                      .filter((itemData, index) => index % 2 === 1)
                      .map((itemData, index) => (
                        <TopSongCard
                          data={itemData}
                          numRow={2}
                          index={index}
                          togglePlay={() => togglePlay(itemData)}
                          key={`top_song_2_index_${itemData.index}`}
                        />
                      ))}
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={{marginTop: 15, paddingBottom: 100}}>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>All tracks</Text>
                {/* <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.subAction}>See all</Text>
                </TouchableOpacity> */}
              </View>
              <FlatList
                data={arrAllTracks}
                style={{marginTop: 6}}
                renderItem={itemData => {
                  return (
                    <RecentReleaseCard
                      data={itemData}
                      togglePlay={() => {
                        togglePlay(itemData.item);
                      }}
                      key={`all_track_${itemData.index}`}
                    />
                  );
                }}
                keyExtractor={(item, index) =>
                  `recentRelease-${item?.id}-${index}`
                }
              />
              {isLoaidng && <CommonSkeleton />}
            </View>
          </View>
        </ScrollView>
        {curTrack && showPlayer && (
          <View style={styles.miniPlayer}>
            <MiniMusicPlayer />
          </View>
        )}
      </View>
    );
  } else {
    return <View style={styles.root} />;
  }
};

export default ArtistPage;

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
  body: {
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 50,
  },
  headerFilter: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 330,
  },
  artistMarkContainer: {
    width: 70,
    height: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 110,
  },
  artistMarkTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 10,
  },
  listenerTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 10,
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 330,
  },
  backgroundLight: {position: 'absolute', top: 0, right: 0, height: 330},
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
  topSongRow: {
    flexDirection: 'row',
  },
  miniPlayer: {
    marginBottom: -20,
  },
});
