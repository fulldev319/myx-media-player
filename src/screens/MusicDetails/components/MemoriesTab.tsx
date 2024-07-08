/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {ScrollView} from 'native-base';
import {MemoryCard} from 'components/cards/MemoryCard';
import {PostLayoutType} from 'helper/constants';
import {apiGetFriendMemories} from 'helper/memoryHelpers';
import {apiGetTrackMemories} from 'helper/trackHelpers';
import TileIcon from 'assets/svg/TileIcon';
import ListIcon from 'assets/svg/ListIcon';
import defaultAvatar from 'assets/images/default_avatar.png';
import {useNavigation} from '@react-navigation/native';

enum ViewType {
  Tile,
  List,
}

export const MemoriesTab = ({track}) => {
  const {navigate} = useNavigation();

  const [memoryList, setMemoryList] = useState([]);
  const [friendMemoryList, setFriendMemoryList] = useState([]);
  const [lastId, setLastId] = useState(undefined);
  const [friendLastId, setFriendLastId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreFriend, setHasMoreFriend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingFriend, setLoadingFriend] = useState(false);
  const [viewType, setViewType] = useState(ViewType.Tile);

  useEffect(() => {
    if (track && track.id) {
      getFriendsMemories();
      getTrackMemories();
    }
  }, [track]);

  const getTrackMemories = () => {
    if (!hasMore || loading) {
      return;
    }
    setLoading(true);
    apiGetTrackMemories(lastId, track.id)
      .then(res => {
        if (res.success) {
          setMemoryList(prev => [...prev, ...res.data]);
          setHasMore(res.hasMore);
          setLastId(res.lastId);
        } else {
          setHasMore(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getFriendsMemories = () => {
    if (!hasMoreFriend || loadingFriend) {
      return;
    }
    setLoadingFriend(true);
    const params = {
      trackId: track.id,
      offset: friendLastId,
    };
    apiGetFriendMemories(params)
      .then(res => {
        if (res.success) {
          setFriendMemoryList(prev => [...prev, ...res.data]);
          setHasMoreFriend(res.hasMore);
          setFriendLastId(res.lastId);
        } else {
          setHasMoreFriend(false);
        }
      })
      .finally(() => {
        setLoadingFriend(false);
      });
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleScroll = e => {
    if (!loading && isCloseToBottom(e.nativeEvent)) {
      getTrackMemories();
    }
  };

  const firstCol = useMemo(
    () => memoryList.filter((memory, index) => index % 2 === 0),
    [memoryList],
  );
  const secondCol = useMemo(
    () => memoryList.filter((memory, index) => index % 2 === 1),
    [memoryList],
  );

  const onDetail = itemData => {
    navigate('FeedDetailPage', {feedId: itemData.id});
  };

  return (
    <View style={styles.container}>
      {friendMemoryList && friendMemoryList.length > 0 && (
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>Your friends memories</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.subAction}>See All</Text>
          </TouchableOpacity>
        </View>
      )}
      {friendMemoryList && friendMemoryList.length > 0 ? (
        <FlatList
          data={friendMemoryList}
          horizontal
          style={{marginTop: 20}}
          renderItem={item => {
            return (
              <View
                style={{
                  height: 108,
                  width: 80,
                  borderRadius: 8,
                  marginRight: 8,
                }}>
                <Image
                  source={{uri: item?.image}}
                  resizeMode="cover"
                  style={{width: '100%', height: '100%'}}
                />
                <Image
                  source={
                    item?.user?.image ? {uri: item?.user?.image} : defaultAvatar
                  }
                  style={styles.ownerImage}
                />
              </View>
            );
          }}
          keyExtractor={(item, index) => `${item?.id}-${index}`}
        />
      ) : loadingFriend ? (
        <View style={{marginTop: 16}}>
          <ActivityIndicator size="large" color="#777777" />
        </View>
      ) : (
        <></>
      )}
      <ScrollView style={styles.root} onScroll={handleScroll}>
        <View style={styles.heading}>
          <Text style={styles.caption}>{`${memoryList.length} memories`}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => setViewType(ViewType.Tile)}
              style={{marginRight: 8}}>
              <TileIcon clicked={viewType === ViewType.Tile} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewType(ViewType.List)}>
              <ListIcon clicked={viewType === ViewType.List} />
            </TouchableOpacity>
          </View>
        </View>
        {viewType === ViewType.Tile ? (
          <View style={styles.postLayoutSecond}>
            <View style={{flex: 1, marginRight: 18}}>
              {firstCol.map(item => (
                <MemoryCard
                  type={PostLayoutType.Small}
                  data={{...item, song: track}}
                  key={item.id}
                  onClicked={() => onDetail(item)}
                />
              ))}
            </View>
            <View style={{flex: 1}}>
              {secondCol.map(item => (
                <MemoryCard
                  type={PostLayoutType.Small}
                  data={{...item, song: track}}
                  key={item.id}
                  onClicked={() => onDetail(item)}
                />
              ))}
            </View>
          </View>
        ) : (
          <View>
            {memoryList.map(item => (
              <MemoryCard
                type={PostLayoutType.Large}
                data={item}
                key={item.id}
                onClicked={() => onDetail(item)}
              />
            ))}
          </View>
        )}
      </ScrollView>
      {loading && (
        <View style={{marginTop: 16}}>
          <ActivityIndicator size="large" color="#777777" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  postLayoutFirst: {
    flexDirection: 'row',
  },
  postLayoutSecond: {
    flexDirection: 'row',
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  subAction: {
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: '#FF6651',
  },
  ownerImage: {
    width: 24,
    height: 24,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
});
