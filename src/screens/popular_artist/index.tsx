import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import * as Progress from 'react-native-progress';
import {DarkBorderBackIcon} from 'assets/svg';
import {apiGetTopArtist} from 'helper/trackHelpers';
import {SCREEN_WIDTH} from 'helper/utils';
import {apiFollowArtist, apiUnFollowArtist} from 'helper/artistHelper';
import {PopularArtistCard} from './PopularArtistCard';
import {useNavigation} from '@react-navigation/native';
import {CommonSkeleton} from 'components/common/Skeleton';

export const PopularArtistsPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {navigate} = useNavigation();
  const cardWidth = (SCREEN_WIDTH - 40 - 8) / 2;
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [arrArtists, setArrArtists] = useState([]);
  const [arrFollowed, setArrFollowed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    loadMoreArtists();
  }, []);

  const loadMoreArtists = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);

      const res = await apiGetTopArtist(lastId);
      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);

        setArrArtists(prev => [...prev, ...res.data]);
        const followedUsers = res.data.filter(
          (item, index) => item.isFollowed === true,
        );
        setArrFollowed(prev => [...prev, ...followedUsers]);
      }

      setIsLoading(false);
    }
  };

  const onFollowArtist = async artist => {
    setShowLoading(true);
    const res = await apiFollowArtist(artist.id);
    if (res.success) {
      setArrFollowed(prev => [...prev, ...[artist]]);
    }
    setShowLoading(false);
  };

  const onUnfollowArtist = async artist => {
    setShowLoading(true);
    const res = await apiUnFollowArtist(artist.id);

    if (res.success) {
      const filteredArr = arrFollowed.filter((item, index) => item !== artist);
      setArrFollowed(filteredArr);
    }
    setShowLoading(false);
  };

  const onGoToArtist = artistInfo => {
    navigate('ArtistPage', {artistId: artistInfo.id});
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.root}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMoreArtists();
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
        <Text style={styles.title}>Popular Artists</Text>
        <View style={styles.divider} />
        <View style={styles.musicList}>
          {arrArtists.map((item, index) => {
            const isFollowing = arrFollowed.filter(
              (followedItem, index) => item.id === followedItem.id,
            );

            return (
              <PopularArtistCard
                data={item}
                isFollowing={isFollowing.length > 0}
                onFollow={artist => onFollowArtist(artist)}
                onUnFollow={artist => onUnfollowArtist(artist)}
                onDetail={onGoToArtist}
                style={{width: cardWidth, marginBottom: 16}}
              />
            );
          })}
        </View>
        {isLoading && (
          <View style={{marginTop: -30, height: 100}}>
            <CommonSkeleton />
          </View>
        )}
      </ScrollView>
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
    marginTop: 40,
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 28,
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  musicList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 36,
  },
  playAllContainer: {
    alignItems: 'center',
    marginTop: -30,
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
    marginBottom: -20,
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
