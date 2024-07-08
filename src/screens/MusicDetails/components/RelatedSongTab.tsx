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
import defaultAvatar from 'assets/images/default_avatar.png';
import {apiGetRelatedPublicTracks} from 'helper/feedHelpers';

export const RelatedSongTab = ({trackId}) => {
  const [relatedTrackList, setRelatedTrackList] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trackId) {
      getTrackMemories();
    }
  }, [trackId]);

  const getTrackMemories = () => {
    if (!hasMore || loading) {
      return;
    }
    setLoading(true);
    const params = {
      trackId: trackId,
      offset: lastId,
    };
    apiGetRelatedPublicTracks(params)
      .then(res => {
        if (res.success) {
          setRelatedTrackList(prev => [...prev, ...res.data]);
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

  return (
    <>
      {relatedTrackList && relatedTrackList.length > 0 ? (
        relatedTrackList.map((item, idx) => (
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 16,
              padding: 12,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              marginTop: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item?.track?.image}}
                  style={{width: 32, height: 32, borderRadius: 8}}
                  resizeMode="cover"
                />
                <View style={{marginLeft: 12}}>
                  <Text
                    style={styles.songTitle}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {item?.track?.title}
                  </Text>
                  <Text
                    style={styles.description}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {item?.track?.artists[0]}
                  </Text>
                </View>
              </View>
              <Text
                style={{fontSize: 12, color: '#ffffff80'}}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {`${item.memories.length} memories`}
              </Text>
            </View>
            <FlatList
              data={item.memories}
              horizontal
              style={{marginTop: 20}}
              renderItem={itemData => {
                return (
                  <View
                    style={{
                      height: 108,
                      width: 80,
                      borderRadius: 8,
                      marginRight: 8,
                    }}>
                    <Image
                      source={
                        itemData.image ? {uri: itemData.image} : defaultAvatar
                      }
                      resizeMode="cover"
                      style={{width: '100%', height: '100%'}}
                    />
                    <Image
                      source={
                        itemData.user.image
                          ? {uri: itemData.user.image}
                          : defaultAvatar
                      }
                      style={styles.ownerImage}
                    />
                  </View>
                );
              }}
              keyExtractor={(item, index) => `${item?.id}-${index}`}
            />
          </View>
        ))
      ) : !loading ? (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            marginTop: 32,
          }}>
          <Text style={{color: '#fff', fontSize: 14}}>No Data</Text>
        </View>
      ) : (
        <View style={{marginTop: 32}}>
          <ActivityIndicator size="large" color="#777777" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  songTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
  },
  description: {
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
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
