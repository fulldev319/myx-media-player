import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {SearchBar} from 'components/common/SearchBar';

import {styles} from './index.styles';
import {BlackBackIcon} from 'components/profile/assets/svgs/BlackBackIcon';
import {FollowCard, FollowData} from '../FollowCard';
import {
  generateComponentKey,
  getArrFromString,
  SCREEN_HEIGHT,
} from 'helper/utils';
import {apiGetFollowers} from 'helper/userHelpers';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {apiGetCountryDetail} from 'helper/mapHelper';
import {useNavigation} from '@react-navigation/native';

export const FollowerSheet = ({show, onClose}) => {
  const navigation = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [SCREEN_HEIGHT - 100, SCREEN_HEIGHT - 100],
    [],
  );

  const [searchText, setSearchText] = useState('');
  const [arrData, setArrData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    } else {
    }
  }, []);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
      setSearchText('');
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  useEffect(() => {
    if (searchText === '') {
      loadData(true);
    } else {
      loadData(true, true, searchText);
    }
  }, [searchText]);

  const onBack = () => {
    sheetRef.current?.close();
    onClose();
  };

  const loadData = async (
    isRefresh = false,
    isSearch = false,
    newSearchText = '',
  ) => {
    if (isRefresh) {
      setIsLoading(true);
      const res = await apiGetFollowers(
        user.id,
        null,
        !isSearch ? '' : newSearchText,
      );

      if (res.success) {
        setLastId(res.lastId);
        setHasMore(res.hasMore);
        setArrData(res.data);
        setTotalUsers(res.count);
      }
      setIsLoading(false);
    } else {
      if (hasMore && !isLoading) {
        setIsLoading(true);
        const res = await apiGetFollowers(
          user.id,
          lastId,
          !isSearch ? '' : searchText,
        );

        if (res.success) {
          setLastId(res.lastId);
          setHasMore(res.hasMore);
          setArrData(prev => [...prev, ...res.data]);
          setTotalUsers(res.count);
        }
        setIsLoading(false);
      }
    }
  };

  const onGoToCountryDetail = async countryId => {
    const res = await apiGetCountryDetail(countryId);
    if (res.success) {
      onBack();

      setTimeout(() => {
        navigation.navigate('NewWorldPage', {countryDetail: res.data});
      }, 500);
    }
  };

  const arrUsers = useMemo<FollowData[]>(() => {
    const convertedData = arrData.map((item, _) => {
      let userItem: FollowData = {
        id: item.id,
        userName: item.name,
        userImage: item.image,
        countries: getArrFromString(item.countries),
        countryNames: getArrFromString(item.country_names),
        countryImages: getArrFromString(item.country_images),
        followers: item.followers,
        posts: item.posts,
        followStatus: item.isFollowed,
      };

      return userItem;
    });

    return convertedData;
  }, [arrData]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <BlackBackIcon />
        </TouchableOpacity>
        <Text style={styles.title}>{`Followers (${totalUsers})`}</Text>
      </View>
    );
  };

  const renderSearch = () => {
    return (
      <View style={styles.searchView}>
        <SearchBar
          value={searchText}
          txtPlaceholder="Search countries here..."
          onChangedText={setSearchText}
          theme={'gray'}
          style={{
            backgroundColor: '#F3F4F5',
            height: 40,
          }}
        />
      </View>
    );
  };

  const renderBody = () => {
    return (
      <BottomSheetScrollView
        style={{marginTop: 20}}
        showsVerticalScrollIndicator={false}>
        <View>
          {arrUsers.map((item, index) => {
            return (
              <FollowCard
                type={'follower'}
                data={item}
                onGoToCountryDetail={onGoToCountryDetail}
                key={`${generateComponentKey()}`}
              />
            );
          })}
        </View>
      </BottomSheetScrollView>
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
        {renderHeader()}
        {renderSearch()}
        {renderBody()}
      </View>
    </BottomSheetModal>
  );
};
