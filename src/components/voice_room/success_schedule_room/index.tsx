import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {useCallback, useMemo, useRef} from 'react';

import {styles} from './index.styles';
import Svg, {Circle, Path, Rect} from 'react-native-svg';
import BG_IMG from 'assets/images/bg_room.png';
import {SCREEN_WIDTH} from 'helper/utils';

export const SuccessSchedule = ({show, onClose}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [400, 400], []);

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
      <View
        style={[
          StyleSheet.absoluteFill,
          {top: 16, left: 16, right: 16, bottom: 30, alignItems: 'center'},
        ]}>
        <SuccessIcon />
        <Text style={styles.title}>
          Your Voice Room {'\n'} Successfully Scheduled!
        </Text>
        <View
          style={{
            width: '100%',
            height: 130,
            borderRadius: 12,
            padding: 20,
            flexDirection: 'row',
            marginVertical: 20,
          }}>
          <Image
            source={BG_IMG}
            style={{
              position: 'absolute',
              width: SCREEN_WIDTH - 32,
              height: 130,
              left: 0,
              top: 0,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
          <View style={{flex: 1, height: '100%'}}>
            <WhiteMicIcon />
            <Text style={styles.roomTitle}>Midnight Thoughts</Text>
            <Text style={styles.roomDate}>Aug 12, 07:30 AM</Text>
          </View>
          <View
            style={{
              marginStart: 8,
              justifyContent: 'space-between',
              height: '100%',
            }}>
            <WhiteSendIcon />
            <WhiteShareIcon />
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: '100%',
            height: 45,
            borderRadius: 45,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onClose}>
          <Text style={styles.backTo}>Back to Slambook</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

const SuccessIcon = props => (
  <Svg width="33" height="32" fill="none" viewBox="0 0 33 32">
    <Path
      fill="#08B883"
      d="M20.127 11.721l-5.72 5.734-2.2-2.2a1.333 1.333 0 10-1.88 1.88l3.133 3.146a1.333 1.333 0 001.88 0l6.667-6.666a1.332 1.332 0 00-.94-2.281c-.353 0-.69.139-.94.387zM16.5 2.668a13.333 13.333 0 100 26.667 13.333 13.333 0 000-26.667zm0 24a10.666 10.666 0 110-21.333 10.666 10.666 0 010 21.333z"></Path>
  </Svg>
);

const WhiteMicIcon = () => (
  <Svg width="40" height="40" fill="none" viewBox="0 0 40 40">
    <Rect width="40" height="40" fill="#fff" fillOpacity="0.2" rx="20"></Rect>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M16 31h8M20 27v4M20 9a3 3 0 00-3 3v8a3 3 0 006 0v-8a3 3 0 00-3-3v0z"></Path>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M27 18v2a7 7 0 11-14 0v-2"></Path>
  </Svg>
);

const WhiteSendIcon = () => (
  <Svg width="40" height="41" fill="none" viewBox="0 0 40 41">
    <Rect width="40" height="40" y="0.5" fill="#FF8433" rx="20"></Rect>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M26.667 13.832l-7.334 7.333M26.667 13.832L22 27.165l-2.667-6-6-2.666 13.334-4.667z"></Path>
    <Rect
      width="39"
      height="39"
      x="0.5"
      y="1"
      stroke="#DDD"
      strokeOpacity="0.2"
      rx="19.5"></Rect>
  </Svg>
);

const WhiteShareIcon = () => (
  <Svg width="40" height="41" fill="none" viewBox="0 0 40 41">
    <Rect width="40" height="40" y="0.5" fill="#FF8433" rx="20"></Rect>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M24 27.168a2 2 0 100-4 2 2 0 000 4zM16 22.5a2 2 0 100-4 2 2 0 000 4zM17.727 21.508l4.553 2.653M24 17.832a2 2 0 100-4 2 2 0 000 4zM22.273 16.84l-4.546 2.653"></Path>
    <Rect
      width="39"
      height="39"
      x="0.5"
      y="1"
      stroke="#DDD"
      strokeOpacity="0.2"
      rx="19.5"></Rect>
  </Svg>
);
