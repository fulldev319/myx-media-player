/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {MemoryCard} from 'components/cards/MemoryCard';
import {PostLayoutType} from 'helper/constants';
import {ScrollView} from 'native-base';
import {apiGetTaggedMemories, apiGetTaggedRequest} from 'helper/userHelpers';
import TileIcon from 'assets/svg/TileIcon';
import ListIcon from 'assets/svg/ListIcon';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

enum ViewType {
  Tile,
  List,
}

export const TaggedTab = ({userId}) => {
  const {navigate} = useNavigation();
  const {taggedRequestCount} = useSelector((state: RootState) => state.profile);

  const [memoryList, setMemoryList] = useState([]);
  const [lastId, setLastId] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState(ViewType.Tile);

  useEffect(() => {
    if (userId) {
      getCreatedMemories();
    }
  }, [userId]);

  const getCreatedMemories = async () => {
    if (!hasMore || loading) {
      return;
    }
    setLoading(true);

    apiGetTaggedMemories({
      userId: userId,
      offset: lastId,
    })
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

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleScroll = e => {
    if (!loading && isCloseToBottom(e.nativeEvent)) {
      getCreatedMemories();
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

  const renderNotification = () => {
    return (
      <View style={styles.notificationView}>
        <Text style={styles.notificationDescTxt}>
          {taggedRequestCount} people just tagged you in a memory
        </Text>
        <Text
          style={styles.notificationReviewTxt}
          onPress={() => {
            navigate('NewTaggedPage');
          }}>
          Review
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.root} onScroll={handleScroll}>
        {taggedRequestCount > 0 && renderNotification()}
        <View style={styles.heading}>
          <Text style={styles.caption}>Tagged</Text>
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
            <View style={{flex: 1, marginRight: 16}}>
              {firstCol.map(item => (
                <MemoryCard
                  type={PostLayoutType.Small}
                  data={item}
                  key={item.id}
                  onClicked={() => onDetail(item)}
                />
              ))}
            </View>
            <View style={{flex: 1}}>
              {secondCol.map(item => (
                <MemoryCard
                  type={PostLayoutType.Small}
                  data={item}
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
    paddingHorizontal: 28,
  },
  container: {
    display: 'flex',
  },
  notificationView: {
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationDescTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'white',
  },
  notificationReviewTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FF6651',
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
    fontSize: 20,
    fontWeight: '500',
  },
});