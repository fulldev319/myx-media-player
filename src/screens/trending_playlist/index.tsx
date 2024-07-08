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
import {apiGetTrendingPlaylist} from 'helper/trackHelpers';
import {TrendingPlaylistCard} from './TrendingPlaylistCard';
import {CommonSkeleton} from 'components/common/Skeleton';

export const TrendingPlaylistPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const [arrPlaylist, setArrPlaylist] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPlaylist();
  }, []);

  const loadPlaylist = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      const res = await apiGetTrendingPlaylist(lastId);

      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setArrPlaylist(prev => [...prev, ...res.data]);
      }

      setIsLoading(false);
    }
  };

  const onDetail = playlist => {
    navigation.navigate('TrackPlayListPage', {playlistId: playlist.id});
  };

  const onPlay = playlist => {
    navigation.navigate('TrackPlayListPage', {
      playlistId: playlist.id,
      autoPlay: true,
    });
  };

  return (
    <ScrollView
      style={styles.root}
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)) {
          loadPlaylist();
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
      <Text style={styles.title}>Trending Playlists</Text>
      <View style={styles.divider} />
      <View style={styles.musicList}>
        <FlatList
          data={arrPlaylist}
          renderItem={itemData => {
            return (
              <TrendingPlaylistCard
                data={itemData}
                OnDetail={onDetail}
                onPlay={onPlay}
              />
            );
          }}
          keyExtractor={(item, index) => `playlist-${item?.id}-${index}`}
        />
        {isLoading && <CommonSkeleton />}
      </View>
    </ScrollView>
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
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
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
    marginBottom: 100,
    padding: 20,
  },
});
