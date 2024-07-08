import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {styles} from './index.styles';

export const Success = ({show, onClose, onView}) => {
  const SuccessSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [300, 300], []);

  useEffect(() => {
    if (show) {
      SuccessSheetRef.current?.present();
    } else {
      SuccessSheetRef.current?.close();
    }
  }, [show]);

  return (
    <BottomSheetModal
      ref={SuccessSheetRef}
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
          <Text style={{fontSize: 30}}>✅</Text>
          <Text style={styles.txtNewWorld}>Created Countries Success!</Text>
          <Text style={styles.txtDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit ut in
            amet elit, dictum.
          </Text>
          <TouchableOpacity style={styles.btnExplore} onPress={onView}>
            <Text style={styles.txtBtnExplore}>View My Countries</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};
