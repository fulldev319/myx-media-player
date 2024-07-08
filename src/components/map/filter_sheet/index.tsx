import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import SwitchToggle from 'react-native-switch-toggle';

import {styles} from './index.styles';
import {
  GrayHeadPhoneIcon,
  GrayPlayCircleIcon,
  GrayRadioIcon,
  GrayStarIcon,
} from 'assets/svg';
import {RootState, MapSettingType} from 'redux/interfaces';
import mapAction from 'redux/map/actions';
import {useDispatch, useSelector} from 'react-redux';
import {apiUpdateMapSettings} from 'helper/mapHelper';

export const MapFilterSheet = ({show, onClose}) => {
  const dispatch = useDispatch();
  const {mapSetting} = useSelector((state: RootState) => state.map);
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [375, 375], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    } else {
    }
  }, []);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  const updateMapSetting = async (type: string) => {
    const updateMapSetting: MapSettingType = mapSetting;

    if (type === 'radios') {
      updateMapSetting.radios = !updateMapSetting.radios;
    } else if (type === 'friends') {
      updateMapSetting.friends = !updateMapSetting.friends;
    } else if (type === 'artists') {
      updateMapSetting.artists = !updateMapSetting.artists;
    } else if (type === 'memories') {
      updateMapSetting.memories = !updateMapSetting.memories;
    }

    dispatch(mapAction.setMapSetting(updateMapSetting));
    await apiUpdateMapSettings(updateMapSetting);
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
        <Text style={styles.title}>Filter</Text>
        <View style={styles.itemRow}>
          <View style={styles.itemIconContainer}>
            <GrayRadioIcon />
          </View>
          <View style={styles.itemInfoContainer}>
            <Text style={styles.itemTitle}>Radios</Text>
            <Text style={styles.itemDescription}>
              Dolor ae tellus eu ac platea.
            </Text>
          </View>
          <View style={{flex: 1}} />
          <SwitchToggle
            switchOn={mapSetting?.radios}
            onPress={() => {
              updateMapSetting('radios');
            }}
            containerStyle={styles.switchContianer}
            circleStyle={styles.switchCircle}
            circleColorOn="white"
            circleColorOff="white"
            backgroundColorOn="#FF3F3F"
            backgroundColorOff="rgba(0, 0, 0, 0.15)"
          />
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemIconContainer}>
            <GrayHeadPhoneIcon />
          </View>
          <View style={styles.itemInfoContainer}>
            <Text style={styles.itemTitle}>Listened Songs</Text>
            <Text style={styles.itemDescription}>
              Dolor aenean risus at tellus eu ac platea.
            </Text>
          </View>
          <View style={{flex: 1}} />
          <SwitchToggle
            switchOn={mapSetting?.friends}
            onPress={() => {
              updateMapSetting('friends');
            }}
            containerStyle={styles.switchContianer}
            circleStyle={styles.switchCircle}
            circleColorOn="white"
            circleColorOff="white"
            backgroundColorOn="#FF3F3F"
            backgroundColorOff="rgba(0, 0, 0, 0.15)"
          />
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemIconContainer}>
            <GrayStarIcon />
          </View>
          <View style={styles.itemInfoContainer}>
            <Text style={styles.itemTitle}>Artists</Text>
            <Text style={styles.itemDescription}>
              Dolor aenean risus at tellus eu.
            </Text>
          </View>
          <View style={{flex: 1}} />
          <SwitchToggle
            switchOn={mapSetting?.artists}
            onPress={() => {
              updateMapSetting('artists');
            }}
            containerStyle={styles.switchContianer}
            circleStyle={styles.switchCircle}
            circleColorOn="white"
            circleColorOff="white"
            backgroundColorOn="#FF3F3F"
            backgroundColorOff="rgba(0, 0, 0, 0.15)"
          />
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemIconContainer}>
            <GrayPlayCircleIcon />
          </View>
          <View style={styles.itemInfoContainer}>
            <Text style={styles.itemTitle}>Memories</Text>
            <Text style={styles.itemDescription}>
              Dolor aenean risus at tel ac platea.
            </Text>
          </View>
          <View style={{flex: 1}} />
          <SwitchToggle
            switchOn={mapSetting?.memories}
            onPress={() => {
              updateMapSetting('memories');
            }}
            containerStyle={styles.switchContianer}
            circleStyle={styles.switchCircle}
            circleColorOn="white"
            circleColorOff="white"
            backgroundColorOn="#FF3F3F"
            backgroundColorOff="rgba(0, 0, 0, 0.15)"
          />
        </View>
      </View>
    </BottomSheetModal>
  );
};
