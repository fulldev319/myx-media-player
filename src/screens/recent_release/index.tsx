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
import {apiGetRecentRelease} from 'helper/trackHelpers';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {RecentReleaseCard} from 'components/cards/RecentReleaseCard';
import {CommonSkeleton} from 'components/common/Skeleton';

export const RecentReleasePage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [arrRecentRelease, setArrRecentRelease] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMusic();
  }, []);

  const loadMusic = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      const res = await apiGetRecentRelease(lastId);

      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setArrRecentRelease(prev => [...prev, ...res.data]);
      }
      setIsLoading(false);
    }
  };

  return (
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
      <Text style={styles.title}>Recent Releases</Text>
      <View style={styles.divider} />
      <View style={styles.musicList}>
        <FlatList
          data={arrRecentRelease}
          renderItem={itemData => {
            return (
              <RecentReleaseCard
                data={itemData}
                key={itemData.index}
                togglePlay={() => {}}
              />
            );
          }}
          keyExtractor={(item, index) => `recentRelease-${item?.id}-${index}`}
        />
        {/* {isLoading && (
          <View>
            <CommonSkeleton />
          </View>
        )} */}
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
