import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {styles} from './index.styles';
import {SearchBar} from 'components/common/SearchBar';
import {CardFriend} from './CardFriend';

import {apiGetMapFriends} from 'helper/mapHelper';
import {CommonSkeleton} from 'components/common/Skeleton';

export const MapYourFriend = ({show, navigation, onClose, onLocation}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['90%', '90%'], []);

  const [searchText, setSearchText] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [arrFriends, setArrFriends] = useState([]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    } else {
    }
  }, []);

  useEffect(() => {
    if (show) {
      loadFriends();
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  const loadFriends = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      const res = await apiGetMapFriends(lastId);
      if (res.sucess) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setArrFriends(prev => [...prev, ...res.data]);
      }
      setIsLoading(false);
    }
  };

  const onGoToLocation = location => {
    sheetRef.current?.close();

    onLocation(location);
  };

  const renderHeader = () => {
    return (
      <View>
        <Text style={styles.title}>Your friends</Text>
        <View style={{marginTop: 20}}>
          <SearchBar
            value={searchText}
            txtPlaceholder="Search here..."
            onChangedText={setSearchText}
            theme={'gray'}
            style={{backgroundColor: '#F3F4F5', height: 40}}
          />
        </View>
      </View>
    );
  };

  const renderUsers = () => {
    return (
      <View style={{marginVertical: 20}}>
        {arrFriends.map((item, index) => (
          <CardFriend
            data={item}
            key={`map_friend_${index}`}
            navigation={navigation}
            onCloseModal={() => sheetRef.current?.close()}
            onGoToLocation={onGoToLocation}
          />
        ))}
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={styles.indicator}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      onChange={handleSheetChanges}>
      <View style={[StyleSheet.absoluteFill, {top: 16, left: 16, right: 16}]}>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              loadFriends();
            }
          }}>
          {renderHeader()}
          {renderUsers()}
          {isLoading && <CommonSkeleton color={'rgba(0, 0, 0, 0.6)'} />}
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};
