import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {styles} from './index.styles';
import BG_HEADER from 'assets/images/bg_world.png';

export const LetExploreSheet = ({show, onClose, onGoToExplore}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [546, 546], []);

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
      <View style={[StyleSheet.absoluteFill]}>
        <Image source={BG_HEADER} style={styles.headerImage} />
        <View style={styles.bodyBg}></View>
        <View
          style={[
            StyleSheet.absoluteFill,
            {paddingTop: 250, marginHorizontal: 21, top: -30},
          ]}>
          <Text style={styles.txtNewWorld}>{`New World \nNew Map.`}</Text>
          <Text style={styles.txtExplore}>Let's Explore</Text>
          <Text style={styles.txtDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit ut in
            amet elit, dictum. Phasellus etiam sit.
          </Text>
          <TouchableOpacity style={styles.btnExplore} onPress={onGoToExplore}>
            <Text style={styles.txtBtnExplore}>Explore Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};
