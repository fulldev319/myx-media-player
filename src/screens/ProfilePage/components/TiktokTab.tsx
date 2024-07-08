/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState, useEffect, useCallback, useRef} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {TiktokCard} from 'components/cards/TiktokCard';
import {PostLayoutType} from 'helper/constants';
import {ScrollView} from 'native-base';
import TileIcon from 'assets/svg/TileIcon';
import ListIcon from 'assets/svg/ListIcon';
import {apiGetTiktokVideo} from 'helper/tiktokHelpers';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import FollowersUserIcon from 'assets/svg/FollowersUser';
import {apiGetOwnedSlambook} from 'helper/slambookHelper';
import {
  mock_image_1,
  mock_image_2,
  mock_image_3,
} from 'components/cards/FeedDirectCard';
import {apiGetTopics} from 'helper/slambookHelper';
import {eventShareToSlambook} from 'helper/socketHelper';

enum ViewType {
  Tile,
  List,
}

export const TiktokTab = ({userId}) => {
  const slambookBottomSheetRef = useRef(null);

  const [viewType, setViewType] = useState(ViewType.Tile);
  const [tiktokList, setTiktokList] = useState([]);
  const [lastTiktokId, setLastTiktokId] = useState(0);
  const [hasMoreTiktok, setHasMoreTiktok] = useState(true);
  const [loadingTiktok, setLoadingTiktok] = useState(false);

  const snapPointsBottomSheet = useMemo(() => [640, 640], []);
  const [isOpenedBottomSheet, setIsOpenedBottomSheet] = useState(false);
  const [hasMoreSlambook, setHasMoreSlambook] = useState(true);
  const [loadingSlambook, setLoadingSlambook] = useState<Boolean>(false);
  const [arrSlambook, setArrSlambook] = useState([]);
  const [slambookLastId, setSlambookLastId] = useState(0);

  const [hasMoreTopic, setHasMoreTopic] = useState(true);
  const [loadingTopic, setLoadingTopic] = useState<Boolean>(false);
  const [arrTopic, setArrTopic] = useState([]);
  const [topicLastId, setTopicLastId] = useState(0);

  const [selectedTiktok, setSelectedTiktok] = useState(null);
  const [selectedSlambook, setSelectedSlambook] = useState(null);
  const [stepBottomSheet, setStepBottomSheet] = useState(0);

  useEffect(() => {
    loadTiktokData();
  }, []);

  useEffect(() => {
    if (isOpenedBottomSheet) {
      loadOwnedSlambooks();
    } else {
      setStepBottomSheet(0);
      setSelectedTiktok(null);
      setSelectedSlambook(null);

      setArrTopic([]);
      setHasMoreTopic(true);
      setLoadingTopic(false);
      setTopicLastId(0);
    }
  }, [isOpenedBottomSheet]);

  useEffect(() => {
    if (selectedSlambook && selectedSlambook.id) {
      loadTopicData();
    }
  }, [selectedSlambook]);

  const loadTiktokData = async () => {
    if (!hasMoreTiktok || loadingTiktok) {
      return;
    }
    setLoadingTiktok(true);
    apiGetTiktokVideo({
      user: userId,
      offset: lastTiktokId,
    })
      .then(res => {
        if (res.success) {
          setTiktokList(prev => [...prev, ...res.data]);
          setHasMoreTiktok(res.hasMore);
          setLastTiktokId(res.lastId);
        } else {
          setHasMoreTiktok(false);
        }
      })
      .finally(() => {
        setLoadingTiktok(false);
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
    if (!loadingTiktok && isCloseToBottom(e.nativeEvent)) {
      loadTiktokData();
    }
  };

  const firstCol = useMemo(
    () => tiktokList.filter((item, index) => index % 2 === 0),
    [tiktokList],
  );
  const secondCol = useMemo(
    () => tiktokList.filter((item, index) => index % 2 === 1),
    [tiktokList],
  );

  const handleSlambookBottomSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedBottomSheet(false);
    } else {
      setIsOpenedBottomSheet(true);
    }
  }, []);

  const loadOwnedSlambooks = async () => {
    if (!hasMoreSlambook || loadingSlambook) {
      return;
    }

    try {
      setLoadingSlambook(true);

      const param = {
        offset: slambookLastId,
      };
      const res = await apiGetOwnedSlambook(param);
      if (res.success) {
        setHasMoreSlambook(res.hasMore);
        setSlambookLastId(res.lastId);
        setArrSlambook(prev => [...prev, ...res.data]);
      }
    } catch (error) {
      console.log('slambook error: ', error);
    } finally {
      setLoadingSlambook(false);
    }
  };

  const loadTopicData = async () => {
    if (!hasMoreTopic || loadingTopic) {
      return;
    }

    try {
      setLoadingTopic(true);
      const res = await apiGetTopics(selectedSlambook.id, topicLastId);

      if (res.success) {
        setHasMoreTopic(res.hasMore);
        setTopicLastId(res.lastId);
        setArrTopic(prev => [...prev, ...res.data]);
      }
    } catch (error) {
      console.log('slambook error: ', error);
    } finally {
      setLoadingTopic(false);
    }
  };

  const handleShareClick = data => {
    setSelectedTiktok(data);
    setIsOpenedBottomSheet(true);
    slambookBottomSheetRef.current?.present();
  };

  const handleSelectTopic = data => {
    const param = {
      userId,
      slambook: selectedSlambook.id,
      topic: data.id,
      message: '',
      hashTags: [],
      mediaTypes: ['video'],
      mediaUrls: [selectedTiktok.video],
      shareId: selectedTiktok.id,
      shareType: 'tiktok',
    };
    eventShareToSlambook(param);

    setIsOpenedBottomSheet(false);
    slambookBottomSheetRef.current?.close();
  };

  const renderSlambookBottomSheet = () => {
    return (
      <BottomSheetModal
        ref={slambookBottomSheetRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.34)',
          marginTop: 24,
        }}
        snapPoints={snapPointsBottomSheet}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleSlambookBottomSheetChanges}>
        <View style={{paddingHorizontal: 24, flex: 1}}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={{fontSize: 22, fontWeight: '600', color: '#fff'}}>
              Choose Slambook
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#ffffff40',
                marginTop: 4,
              }}>
              Turn memories into laugh with your friends!
            </Text>
          </View>
          <BottomSheetScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                loadOwnedSlambooks();
              }
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 32,
                justifyContent: 'space-between',
              }}>
              {stepBottomSheet === 0 ? (
                arrSlambook && arrSlambook.length > 0 ? (
                  arrSlambook.map((item, index) => {
                    if (index % 3 === 0) {
                      return (
                        <TouchableOpacity
                          style={{
                            width: 160,
                            height: 160,
                            marginBottom: 32,
                          }}
                          onPress={() => {
                            setSelectedSlambook(item);
                            setStepBottomSheet(1);
                          }}>
                          <View>
                            <Image
                              source={{
                                uri:
                                  item?.images.length > 0
                                    ? item?.images[0]
                                    : mock_image_1,
                              }}
                              style={{
                                height: 29,
                                width: '100%',
                                borderRadius: 32,
                              }}
                              resizeMode="cover"
                            />
                            <Image
                              source={{
                                uri:
                                  item?.images.length > 1
                                    ? item?.images[1]
                                    : item?.images.length > 0
                                    ? item?.images[0]
                                    : mock_image_2,
                              }}
                              style={{
                                height: 29,
                                width: '100%',
                                borderRadius: 32,
                                marginVertical: 8,
                              }}
                              resizeMode="cover"
                            />
                            <Image
                              source={{
                                uri:
                                  item?.images.length > 2
                                    ? item?.images[2]
                                    : item?.images.length > 1
                                    ? item?.images[1]
                                    : item?.images.length > 1
                                    ? item?.images[0]
                                    : mock_image_3,
                              }}
                              style={{
                                height: 29,
                                width: '100%',
                                borderRadius: 32,
                              }}
                              resizeMode="cover"
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '500',
                              color: '#fff',
                              marginLeft: 4,
                              marginTop: 16,
                            }}>
                            {item?.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 4,
                              marginLeft: 4,
                            }}>
                            <FollowersUserIcon />
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: '400',
                                color: '#ffffff90',
                                marginLeft: 4,
                              }}>
                              {`${item?.members} members`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    } else if (index % 3 === 1) {
                      return (
                        <TouchableOpacity
                          style={{
                            width: 160,
                            height: 160,
                            marginBottom: 32,
                          }}
                          onPress={() => {
                            setSelectedSlambook(item);
                            setStepBottomSheet(1);
                          }}>
                          <Image
                            source={{
                              uri:
                                item?.images.length > 0
                                  ? item?.images[0]
                                  : mock_image_1,
                            }}
                            style={{
                              height: 29,
                              width: '100%',
                              borderRadius: 32,
                            }}
                            resizeMode="cover"
                          />
                          <View style={{flexDirection: 'row', marginTop: 8}}>
                            <Image
                              source={{
                                uri:
                                  item?.images.length > 1
                                    ? item?.images[1]
                                    : item?.images.length > 0
                                    ? item?.images[0]
                                    : mock_image_2,
                              }}
                              style={{
                                height: 66,
                                width: '48%',
                                borderRadius: 32,
                                marginRight: 8,
                              }}
                              resizeMode="cover"
                            />
                            <Image
                              source={{
                                uri:
                                  item?.images.length > 2
                                    ? item?.images[2]
                                    : item?.images.length > 1
                                    ? item?.images[1]
                                    : item?.images.length > 1
                                    ? item?.images[0]
                                    : mock_image_3,
                              }}
                              style={{
                                height: 66,
                                width: '48%',
                                borderRadius: 8,
                              }}
                              resizeMode="cover"
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '500',
                              color: '#fff',
                              marginLeft: 4,
                              marginTop: 20,
                            }}>
                            {item?.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 4,
                              marginLeft: 4,
                            }}>
                            <FollowersUserIcon />
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: '400',
                                color: '#ffffff90',
                                marginLeft: 4,
                              }}>
                              {`${item?.members} members`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          style={{
                            width: 160,
                            height: 160,
                            marginBottom: 32,
                          }}
                          onPress={() => {
                            setSelectedSlambook(item);
                            setStepBottomSheet(1);
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <View>
                              <Image
                                source={{
                                  uri:
                                    item?.images.length > 0
                                      ? item?.images[0]
                                      : mock_image_1,
                                }}
                                style={{
                                  height: 66,
                                  width: 66,
                                  borderRadius: 32,
                                  marginRight: 8,
                                }}
                                resizeMode="cover"
                              />
                              <Image
                                source={{
                                  uri:
                                    item?.images.length > 1
                                      ? item?.images[1]
                                      : item?.images.length > 0
                                      ? item?.images[0]
                                      : mock_image_2,
                                }}
                                style={{
                                  height: 29,
                                  width: 66,
                                  borderRadius: 32,
                                  marginTop: 8,
                                }}
                                resizeMode="cover"
                              />
                            </View>
                            <View style={{marginLeft: 8}}>
                              <Image
                                source={{
                                  uri:
                                    item?.images.length > 2
                                      ? item?.images[2]
                                      : item?.images.length > 1
                                      ? item?.images[1]
                                      : item?.images.length > 1
                                      ? item?.images[0]
                                      : mock_image_3,
                                }}
                                style={{
                                  height: 29,
                                  width: 66,
                                  borderRadius: 32,
                                }}
                                resizeMode="cover"
                              />
                              <Image
                                source={{
                                  uri:
                                    item?.images.length > 0
                                      ? item?.images[0]
                                      : mock_image_1,
                                }}
                                style={{
                                  height: 66,
                                  width: 66,
                                  borderRadius: 8,
                                  marginTop: 8,
                                }}
                                resizeMode="cover"
                              />
                            </View>
                          </View>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '500',
                              color: '#fff',
                              marginLeft: 4,
                              marginTop: 20,
                            }}>
                            {item?.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 4,
                              marginLeft: 4,
                            }}>
                            <FollowersUserIcon />
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: '400',
                                color: '#ffffff90',
                                marginLeft: 4,
                              }}>
                              {`${item?.members} members`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  })
                ) : loadingSlambook ? (
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      marginTop: 32,
                    }}>
                    <ActivityIndicator size="large" color="#777777" />
                  </View>
                ) : (
                  <View style={{width: '100%', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#fff',
                      }}>
                      No Data
                    </Text>
                  </View>
                )
              ) : arrTopic && arrTopic.length > 0 ? (
                arrTopic.map((item, index) => (
                  <TouchableOpacity
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 80,
                      marginBottom: 32,
                      backgroundColor: '#62F9CB80',
                      padding: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => handleSelectTopic(item)}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#fff',
                      }}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : loadingTopic ? (
                <View
                  style={{width: '100%', alignItems: 'center', marginTop: 32}}>
                  <ActivityIndicator size="large" color="#777777" />
                </View>
              ) : (
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text
                    style={{fontSize: 12, fontWeight: '500', color: '#fff'}}>
                    No Data
                  </Text>
                </View>
              )}
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.root} onScroll={handleScroll}>
        <View style={styles.heading}>
          <Text style={styles.caption}>My Tiktok</Text>
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
                <TiktokCard
                  type={PostLayoutType.Small}
                  data={item}
                  key={item.id}
                />
              ))}
            </View>
            <View style={{flex: 1}}>
              {secondCol.map(item => (
                <TiktokCard
                  type={PostLayoutType.Small}
                  data={item}
                  key={item.id}
                />
              ))}
            </View>
          </View>
        ) : (
          <View>
            {tiktokList.map(item => (
              <TiktokCard
                type={PostLayoutType.Large}
                data={item}
                key={item.id}
                onShareClick={handleShareClick}
              />
            ))}
          </View>
        )}
      </ScrollView>
      {loadingTiktok && (
        <View style={{marginTop: 16}}>
          <ActivityIndicator size="large" color="#777777" />
        </View>
      )}
      {viewType === ViewType.List && renderSlambookBottomSheet()}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 28,
  },
  container: {},
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
