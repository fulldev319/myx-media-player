import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';
import {BackIcon} from 'assets/svg';
import * as Progress from 'react-native-progress';
import {
  apiFollowPeople,
  apiGetTrendingPeople,
  apiUnFollowPeople,
} from 'helper/userHelpers';
import {TrendingPeopleCard} from './TrendingPeopleCard';
import {CommonSkeleton} from 'components/common/Skeleton';

export const TrendingPeoplePage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const [arrTrendingPeople, setArrTrendingPeople] = useState([]);
  const [arrFollowed, setArrFollowed] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadTrendingPeople = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      const res = await apiGetTrendingPeople(lastId);
      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);

        const newData = res.data;
        const covertData = newData.map((item, index) => {
          item.image = item.imageUrl;
          return item;
        });
        setArrTrendingPeople(prev => [...prev, ...covertData]);

        const followedUsers = covertData.filter(
          (item, index) => item.isFollowed === 'true',
        );
        setArrFollowed(prev => [...prev, ...followedUsers]);
      }
      setIsLoading(false);
    }
  };

  const onFollowPeople = async people => {
    setShowLoading(true);
    const res = await apiFollowPeople(people.userId);
    if (res.success) {
      setArrFollowed(prev => [...prev, ...[people]]);
    }
    setShowLoading(false);
  };

  const onUnfollowPeople = async people => {
    setShowLoading(true);
    const res = await apiUnFollowPeople(people.userId);

    if (res.success) {
      const filteredArr = arrFollowed.filter(
        (item, index) => item.userId !== people.userId,
      );
      setArrFollowed(filteredArr);
    }
    setShowLoading(false);
  };

  const onGoToPeopleProfile = peopleId => {
    navigation.navigate('OtherProfilePage', {userId: peopleId});
  };

  useEffect(() => {
    loadTrendingPeople();
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.root}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadTrendingPeople();
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
            <BackIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Trending People</Text>
        <View style={styles.divider} />
        <View style={styles.musicList}>
          <FlatList
            data={arrTrendingPeople}
            renderItem={itemData => {
              const isFollowing = arrFollowed.filter(
                (followedItem, index) =>
                  itemData.item.userId === followedItem.userId,
              );

              return (
                <TrendingPeopleCard
                  data={itemData}
                  isFollowing={isFollowing.length > 0}
                  onFollow={people => onFollowPeople(people)}
                  onUnFollow={people => onUnfollowPeople(people)}
                  onGoToPeopleProfile={onGoToPeopleProfile}
                />
              );
            }}
            keyExtractor={(item, index) =>
              `trendingPeople-${item?.id}-${index}`
            }
          />
          {isLoading && <CommonSkeleton />}
        </View>
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
  header: {
    marginVertical: 20,
    padding: 20,
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 450,
  },
  backgroundLight: {position: 'absolute', top: 0, right: 0, height: 450},
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  musicList: {
    marginBottom: 100,
    padding: 20,
  },
});
