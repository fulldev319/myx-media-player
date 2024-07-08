import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {SearchBar} from 'components/common/SearchBar';

import {styles} from './index.styles';
import {SCREEN_HEIGHT} from 'helper/utils';
import {CardTrendingPlaylist} from './components/CardTrendingPlaylist';
import {CardPlaylistMood} from './components/CardPlaylistMood';
import {CardFollowing} from './components/CardFollowing';
import {CardCoolRadio} from './components/CardCoolRadio';
import {apiGetMapTrendingRadios, apiGetRadioMood} from 'helper/mapHelper';

const RadioDetailSheet = ({show, radios, onClose}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [SCREEN_HEIGHT - 40, SCREEN_HEIGHT - 40],
    [],
  );
  const [searchText, setSearchText] = useState('');
  const [arrTrendingRadio, setArrTrendingRadio] = useState([]);
  const [arrRadioMood, setArrRadioMood] = useState([]);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();

      loadTrendingRadios();
      loadRadioMood();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    } else {
    }
  }, []);

  const loadTrendingRadios = async () => {
    const res = await apiGetMapTrendingRadios(null, 100);

    if (res.success) {
      setArrTrendingRadio(res.data);
    }
  };

  const loadRadioMood = async () => {
    const res = await apiGetRadioMood();

    if (res.sucess) {
      const mapData = new Map(Object.entries(res.data));
      const arrData = Array.from(mapData, ([name, value]) => value);
      setArrRadioMood(arrData);
    }
  };

  const renderHeader = () => {
    return (
      <View style={{marginTop: 20}}>
        <SearchBar
          value={searchText}
          txtPlaceholder="Search here..."
          onChangedText={setSearchText}
          theme={'gray'}
          style={{backgroundColor: '#F3F4F5', height: 40}}
        />
      </View>
    );
  };

  const renderFilterView = () => {
    if (radios.length) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}>
          {radios.map((item, _) => {
            return (
              <TouchableOpacity style={styles.filterItemNormalContainer}>
                <Text style={styles.filterItemText}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      );
    } else {
      return <View />;
    }
  };

  const renderTrendingPlaylist = () => {
    return (
      <View style={styles.subContainer}>
        <Text style={styles.subTitle}>Trending Playlists</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{width: '100%', marginTop: 12}}>
          {arrTrendingRadio.map((item, _) => {
            return <CardTrendingPlaylist data={item} />;
          })}
        </ScrollView>
      </View>
    );
  };

  const renderPlaylistMood = () => {
    return (
      <View style={[styles.subContainer, {marginTop: 30}]}>
        <Text style={styles.subTitle}>Playlists Mood</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{width: '100%', marginTop: 12}}>
          {arrRadioMood.map((item, _) => {
            return <CardPlaylistMood data={item} />;
          })}
        </ScrollView>
      </View>
    );
  };

  const renderFollowing = () => {
    return (
      <View style={[styles.subContainer, {marginTop: 30}]}>
        <Text style={styles.subTitle}>From you following</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{width: '100%', marginTop: 12}}>
          {Array(10)
            .fill(0)
            .map((item, _) => {
              return <CardFollowing />;
            })}
        </ScrollView>
      </View>
    );
  };

  const renderCoolRadio = () => {
    return (
      <View style={[styles.subContainer, {marginTop: 30}]}>
        <Text style={[styles.subTitle, {marginBottom: 16}]}>
          Cool Radio in the Area
        </Text>
        {radios.map((item, _) => {
          return <CardCoolRadio data={item} />;
        })}
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
          contentContainerStyle={{paddingBottom: 100}}>
          <View>
            {renderHeader()}
            {/* {renderFilterView()} */}
            {renderTrendingPlaylist()}
            {renderPlaylistMood()}
            {renderFollowing()}
            {renderCoolRadio()}
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
};

export default RadioDetailSheet;
