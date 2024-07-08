import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {SearchBar} from 'components/common/SearchBar';
import Svg, {Path} from 'react-native-svg';

import {
  apiGetCountryDetail,
  apiGetAllCountries,
  apiGetSearchCountries,
} from 'helper/mapHelper';
import {styles} from './index.styles';
import {CardCountry} from '../common/CardCountry';

export const FullExploreCountry = ({show, onClose, onDetail}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['95%', '95%'], []);
  const [searchText, setSearchText] = useState('');

  const [arrCountries, setArrCountries] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    console.log({searchText});
    if (searchText !== '') {
      loadData(true, true);
    } else {
      loadData(false, true);
    }
  }, [searchText]);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 40;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const loadData = async (isSearch = false, isRefresh = false) => {
    if (isSearch) {
      if (isRefresh) {
        if (!isLoading) {
          const res = await apiGetSearchCountries(searchText, 10, null);

          setLastId(res.lastId);
          setHasMore(res.hasMore);
          setArrCountries(res.data);
        }
      } else {
        if (hasMore && !isLoading) {
          const res = await apiGetSearchCountries(searchText, 10, lastId);

          setLastId(res.lastId);
          setHasMore(res.hasMore);
          setArrCountries(prev => [...prev, ...res.data]);
        }
      }
    } else {
      if (isRefresh) {
        if (!isLoading) {
          const res = await apiGetAllCountries(10, null);

          setLastId(res.lastId);
          setHasMore(res.hasMore);
          setArrCountries(res.data);
        }
      } else {
        if (hasMore && !isLoading) {
          const res = await apiGetAllCountries(10, lastId);

          setLastId(res.lastId);
          setHasMore(res.hasMore);
          setArrCountries(prev => [...prev, ...res.data]);
        }
      }
    }
  };

  const onShowDetail = async item => {
    const res = await apiGetCountryDetail(item.country);
    if (res.success) onDetail(res.data);
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={{height: 0}}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={true}
      enableDismissOnClose={true}>
      <View style={[StyleSheet.absoluteFill]}>
        <View style={styles.indicator} />
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.txtTitle}>Explore All Countries</Text>
            <FilterIcon />
          </View>
          <SearchBar
            value={searchText}
            txtPlaceholder="Search countries here..."
            onChangedText={setSearchText}
            theme={'gray'}
            style={{backgroundColor: '#F3F4F5', height: 40, marginTop: 20}}
          />
          <FlatList
            data={arrCountries}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => onShowDetail(item)}>
                <CardCountry data={item} />
              </TouchableOpacity>
            )}
            keyExtractor={item =>
              `country_card_${item.longitude}_${item.latitude}`
            }
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
            style={{marginVertical: 20, flex: 1}}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                loadData();
              }
            }}
          />
        </View>
      </View>
    </BottomSheetModal>
  );
};

const FilterIcon = () => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <Path
      fill="#FF6651"
      d="M20 8.18V3a1 1 0 00-2 0v5.18a3 3 0 000 5.64V21a1 1 0 002 0v-7.18a3 3 0 000-5.64zM19 12a1 1 0 110-2 1 1 0 010 2zm-6 2.18V3a1 1 0 00-2 0v11.18a3 3 0 000 5.64V21a1 1 0 002 0v-1.18a3 3 0 000-5.64zM12 18a1 1 0 110-2 1 1 0 010 2zM6 6.18V3a1 1 0 00-2 0v3.18a3 3 0 000 5.64V21a1 1 0 102 0v-9.18a3 3 0 000-5.64zM5 10a1 1 0 110-2 1 1 0 010 2z"></Path>
  </Svg>
);
