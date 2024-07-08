import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {apiGetCountryDetail, apiGetMyCountries} from 'helper/mapHelper';

import {styles} from './index.styles';
import {CardCountry} from '../common/CardCountry';

export const MyCountries = ({show, onClose, onExplore, onDetail}) => {
  const MyCountriesSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [430, 430], []);

  const [arrCountries, setArrCountries] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      MyCountriesSheetRef.current?.present();
    } else {
      MyCountriesSheetRef.current?.close();
    }
  }, [show]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isSearch = false, isRefresh = false) => {
    if (isRefresh) {
      if (!isLoading) {
        const res = await apiGetMyCountries(10, null);

        setLastId(res.lastId);
        setHasMore(res.hasMore);
        setArrCountries(res.data);
      }
    } else {
      if (hasMore && !isLoading) {
        const res = await apiGetMyCountries(10, lastId);

        setLastId(res.lastId);
        setHasMore(res.hasMore);
        setArrCountries(prev => [...prev, ...res.data]);
      }
    }
  };

  const onShowDetail = async item => {
    const res = await apiGetCountryDetail(item.country);
    if (res.success) onDetail(res.data);
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 40;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <BottomSheetModal
      ref={MyCountriesSheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={{height: 0}}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={true}
      enableDismissOnClose={true}>
      <View style={[StyleSheet.absoluteFill]}>
        <View style={styles.body}>
          <View style={styles.indicator}></View>
          <View style={{flex: 1, justifyContent: 'space-between'}}>
            <Text style={styles.txtNewWorld}>My countries</Text>
            <FlatList
              horizontal
              data={arrCountries}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => onShowDetail(item)}>
                  <CardCountry data={item} containerStyle={{marginRight: 10}} />
                </TouchableOpacity>
              )}
              keyExtractor={item =>
                `country_card_${item.longitude}_${item.latitude}`
              }
              showsVerticalScrollIndicator={false}
              style={{marginVertical: 20, flex: 1}}
              onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                  loadData();
                }
              }}
            />
            <TouchableOpacity style={styles.btnExplore} onPress={onExplore}>
              <Text style={styles.txtBtnExplore}>Explore All Countries</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};
