import {useNavigation} from '@react-navigation/native';
import {apiGetForYou} from 'helper/foryouHelper';
import {apiGetCountryDetail} from 'helper/mapHelper';
import {getDefaultAvatar} from 'helper/userHelpers';
import {generateComponentKey, isCloseToBottom} from 'helper/utils';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {CardForYou, ForYouPost} from '../components/CardForYou';

import {styles} from './index.styles';

export const ForYouHomePage = () => {
  const navigation = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const [loadingData, setLoadingData] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [arrData, setArrData] = useState<ForYouPost[]>([]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      const prevTotalCount = arrData.length;
      loadData(true, prevTotalCount == 0 ? 5 : prevTotalCount);
    });
    return focusHandler;
  }, [navigation]);

  const loadData = async (isRefresh = false, limit = 5) => {
    if (isRefresh) {
      setLoadingData(true);

      const res = await apiGetForYou({offset: null, limit: limit});

      if (res.success) {
        setArrData(res.data);
        setHasMore(res.hasMore);
        setLastId(res.lastId);
      }
      setLoadingData(false);
    } else {
      if (hasMore && !loadingData) {
        setLoadingData(true);

        const res = await apiGetForYou({offset: lastId, limit: limit});

        if (res.success) {
          setArrData(prev => [...prev, ...res.data]);
          setHasMore(res.hasMore);
          setLastId(res.lastId);
        }
        setLoadingData(false);
      }
    }
  };

  const goToProfile = () => {
    navigation.navigate('MyProfilePage', {fromOtherPage: true});
  };

  const goToAddEmoji = item => {
    const debateId = item.debate;
    navigation.navigate('EmolikePage', {debateId: debateId});
  };

  const goToCountry = async data => {
    const res = await apiGetCountryDetail(data.country);
    if (res.success) {
      navigation.navigate('NewWorldPage', {countryDetail: res.data});
    }
  };

  const goToOtherProfile = userId => {
    navigation.navigate('MyProfilePage', {fromOtherPage: true, id: userId});
  };

  const renderList = () => {
    return (
      <FlatList
        data={arrData}
        renderItem={({item, index}) => {
          return (
            <CardForYou
              data={item}
              onAddEmoji={() => {
                goToAddEmoji(item);
              }}
              onGotoCountry={() => goToCountry(item)}
              onGoToProfile={userId => {
                goToOtherProfile(userId);
              }}
            />
          );
        }}
        keyExtractor={(item, _) => `for_you_index_${generateComponentKey()}`}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadData();
          }
        }}
        scrollEventThrottle={500}
      />
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.txtTitle}>For You</Text>
        <TouchableOpacity onPress={goToProfile}>
          <Image
            source={
              user?.image === '' || user === undefined || user === null
                ? getDefaultAvatar()
                : {uri: user?.image}
            }
            style={styles.userAvatar}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>{renderList()}</View>
    </View>
  );
};
