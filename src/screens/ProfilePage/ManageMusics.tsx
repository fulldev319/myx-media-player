import {useNavigation} from '@react-navigation/native';
import {DarkBorderBackIcon} from 'assets/svg';
import {CommonSkeleton} from 'components/common/Skeleton';
import {MUSIC_BRANCH, Track, useTracks} from 'contexts/TrackContext';
import {apiGetSavedMusic} from 'helper/userHelpers';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {MiniMusicPlayer} from 'screens/MusicPlayer/MiniMusicPlayer';
import MyMusicItem from './components/MyMusicItem';

const ManageMusicPage = () => {
  const navigation = useNavigation();

  const {curTrack, togglePlayer, playTrack, playlistId, playTrackList} =
    useTracks();
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [arrMusic, setArrMusic] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      const res = await apiGetSavedMusic(lastId);

      if (res.success) {
        setArrMusic(prev => [...prev, ...res.data]);
        setLastId(res.lastId);
        setHasMore(res.hasMore);
      }
      setIsLoading(false);
    }
  };

  const togglePlay = (track: Track) => {
    if (curTrack?.id === track?.id) {
      togglePlayer();
    } else if (track && playlistId && playlistId === MUSIC_BRANCH.SAVED_TRACK) {
      playTrack(track);
    } else {
      playTrackList([track], track?.id, MUSIC_BRANCH.SAVED_TRACK);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <DarkBorderBackIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Manage My Musics</Text>
      </View>
    );
  };

  const renderItems = () => {
    return (
      <View style={{flex: 1}}>
        {arrMusic.map((item, index) => (
          <MyMusicItem
            data={item}
            togglePlay={togglePlay}
            key={`my_music_item_${index}`}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadData();
          }
        }}
        scrollEventThrottle={500}
        style={{paddingHorizontal: 24}}>
        {renderHeader()}
        {renderItems()}
        {isLoading && <CommonSkeleton />}
      </ScrollView>
      {curTrack && (
        <View style={styles.miniPlayer}>
          <MiniMusicPlayer />
        </View>
      )}
    </View>
  );
};

export default ManageMusicPage;

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
    backgroundColor: '#000000',
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {},
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
  },
});
