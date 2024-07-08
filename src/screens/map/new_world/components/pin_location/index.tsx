import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {styles} from './index.styles';

export const PinLocation = ({show, onClose, onPin}) => {
  const PinLocationSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [275, 275], []);

  useEffect(() => {
    if (show) {
      PinLocationSheetRef.current?.present();
    } else {
      PinLocationSheetRef.current?.close();
    }
  }, [show]);

  return (
    <BottomSheetModal
      ref={PinLocationSheetRef}
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
          <Text style={styles.txtNewWorld}>📍</Text>
          <Text style={styles.txtNewWorld}>Pin Location</Text>
          <Text style={styles.txtDesc}>Pan in map to find your perfect place!</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.txtBtnCancel}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnContinue} onPress={onPin}>
              <Text style={styles.txtBtnCreate}>Pin Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};
