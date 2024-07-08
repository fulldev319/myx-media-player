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
import {DarkBorderBackIcon} from 'assets/svg';
import {TrendingMusicCard} from 'components/cards/TrendMusicCard';
import {apiGetTrendingMusic} from 'helper/trackHelpers';
import {MUSIC_BRANCH, Track, useTracks} from 'contexts/TrackContext';
import {MiniMusicPlayer} from 'screens/MusicPlayer/MiniMusicPlayer';
import {CommonSkeleton} from 'components/common/Skeleton';
import {PlayIcon} from 'screens/TrackPlayList/components/TrackPlayListIcons';

export const TrendingMusicPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {curTrack, togglePlayer, playTrack, playlistId, playTrackList} =
    useTracks();
  const [arrMusic, setArrMusic] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMusic();
  }, []);

  const loadMusic = async () => {
    if (hasMore && !isLoading && arrMusic.length < 100) {
      setIsLoading(true);
      const res = await apiGetTrendingMusic(lastId);

      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setArrMusic(prev => [...prev, ...res.data]);
      }

      setIsLoading(false);
    }
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

  const toggleAllPlay = () => {
    if (playlistId && playlistId === MUSIC_BRANCH.TRENED_MUSIC) {
      togglePlayer();
    } else {
      playTrackList(arrMusic, undefined, MUSIC_BRANCH.TRENED_MUSIC);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.root}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMusic();
          }
        }}
        scrollEventThrottle={500}>
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
        <Text style={styles.title}>Trending Music</Text>
        <View style={styles.divider} />
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
          {isLoading && (
            <View style={{height: 100, marginTop: -30}}>
              <CommonSkeleton />
            </View>
          )}
        </View>
      </ScrollView>
      {curTrack ? (
        <View style={styles.miniPlayer}>
          <MiniMusicPlayer />
        </View>
      ) : (
        <View style={[styles.playAllContainer]}>
          <TouchableOpacity style={styles.playAll} onPress={toggleAllPlay}>
            <PlayIcon />
            <Text style={styles.playAllTxt}>Play All</Text>
          </TouchableOpacity>
        </View>
      )}
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
    minHeight: 300,
  },
  playAllContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#010101',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
  },
});
