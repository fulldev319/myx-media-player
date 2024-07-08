import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {SearchBar} from 'components/common/SearchBar';
import Svg, {Path, Rect} from 'react-native-svg';

import {
  apiGetCitizens,
  apiPostJoinCountry,
  apiPostUndoJoinCountry,
} from 'helper/mapHelper';
import {styles} from './index.styles';
import {Citizen} from '../common/Citizen';

export const CountryDetail = ({country, show, onClose}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['95%', '95%', 150, 150, '95%', '95%'], []);
  const [citizens, setCitizens] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    showSuccess &&
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
  }, [showSuccess]);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  useEffect(() => {
    loadData(false, true);
  }, []);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 40;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const loadData = async (isSearch = false, isRefresh = false) => {
    if (isRefresh) {
      if (!isLoading) {
        const res = await apiGetCitizens(country.country, 10, null);

        setLastId(res.lastId);
        setHasMore(res.hasMore);
        setCitizens(res.data);
      }
    } else {
      if (hasMore && !isLoading) {
        const res = await apiGetCitizens(country.country, 10, lastId);

        setLastId(res.lastId);
        setHasMore(res.hasMore);
        setCitizens(prev => [...prev, ...res.data]);
      }
    }
  };

  const onJoin = async () => {
    const res = await apiPostJoinCountry(46);
    if (res.success) {
      loadData();
      setIsJoined(true);
    }
  };

  const onUndo = async () => {
    const res = await apiPostUndoJoinCountry(country.country);
    if (res.success) {
      loadData();
      setIsJoined(false);
    }
    setShowSuccess(false);
  };

  const renderHeader = () => {
    return (
      <ImageBackground
        style={styles.imageBackground}
        source={{
          uri: 'https://thumbs.dreamstime.com/b/forest-panorama-rays-sunlight-scenic-fresh-green-deciduous-trees-sun-casting-its-light-foliage-53826213.jpg',
        }}>
        <View style={styles.indicator}></View>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <LeftArrowIcon />
          </TouchableOpacity>
          <Text style={styles.txtTitle}>Country Detail</Text>
          <TouchableOpacity onPress={onClose}>
            <GoOutIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{country.name}</Text>
          <Text style={styles.title}>{country.creator}</Text>
          <Text style={styles.subTitle}>{country.description}</Text>
        </View>
      </ImageBackground>
    );
  };

  const renderPopulation = () => {
    return (
      <View style={styles.population}>
        <View style={styles.rowItem}>
          <PopulationIcon />
          <View style={{marginLeft: 10}}>
            <Text style={styles.totalPop}>Total Population</Text>
            <Text
              style={styles.totalPerson}>{`${country.population} person`}</Text>
          </View>
        </View>
        {!isJoined && (
          <TouchableOpacity onPress={onJoin} style={styles.btn}>
            <Text style={styles.btnTitle}>Join this Country</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCitizen = () => {
    return (
      <View style={styles.body}>
        <Text style={styles.citizen}>{`Citizens (${citizens.length})`}</Text>
        <FlatList
          data={citizens}
          renderItem={({item, index}) => <Citizen data={item} />}
          keyExtractor={item => `citizen_${item.country}`}
          numColumns={4}
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
    );
  };

  const renderSuccessAlert = () => {
    if (!showSuccess) return;
    return (
      <View style={styles.successAlert}>
        <View style={styles.rowItem}>
          <CheckIcon />
          <Text style={styles.successTxt}>{'Success join this country!'}</Text>
        </View>
        <TouchableOpacity onPress={onUndo}>
          <Text style={styles.undo}>Undo</Text>
        </TouchableOpacity>
      </View>
    );
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
        {renderHeader()}
        {renderPopulation()}
        {renderCitizen()}
        {renderSuccessAlert()}
      </View>
    </BottomSheetModal>
  );
};

const LeftArrowIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18l-6-6 6-6"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GoOutIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PopulationIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <Rect width={32} height={32} rx={16} fill="#9214F5" />
    <Path
      d="M16.2 16.147a3.28 3.28 0 001.133-2.48 3.333 3.333 0 00-6.666 0 3.28 3.28 0 001.133 2.48A5.334 5.334 0 008.667 21 .667.667 0 0010 21a4 4 0 118 0 .667.667 0 101.333 0 5.334 5.334 0 00-3.133-4.853zm-2.2-.48a2 2 0 110-4 2 2 0 010 4zm6.493.213A3.333 3.333 0 0018 10.334a.666.666 0 100 1.333 2 2 0 012 2 2 2 0 01-1 1.726.667.667 0 00-.033 1.134l.26.173.086.047A4.667 4.667 0 0121.98 21a.667.667 0 101.333 0 6 6 0 00-2.82-5.12z"
      fill="#fff"
    />
  </Svg>
);

const CheckIcon = () => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Rect width={32} height={32} rx={16} fill="#08B883" />
    <Path
      d="M20.473 12.807a.667.667 0 00-.946 0L14.56 17.78l-2.087-2.093a.68.68 0 10-.946.98l2.56 2.56a.665.665 0 00.946 0l5.44-5.44a.668.668 0 000-.98z"
      fill="#fff"
    />
  </Svg>
);
