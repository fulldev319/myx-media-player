import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {styles} from './index.styles';

export const Welcome = ({show, onClose, onExplore}) => {
  const WelcomeSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [380, 380], []);

  useEffect(() => {
    if (show) {
      WelcomeSheetRef.current?.present();
    } else {
      WelcomeSheetRef.current?.close();
    }
  }, [show]);

  return (
    <BottomSheetModal
      ref={WelcomeSheetRef}
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
          <View style={styles.topView}>
            <Text style={{fontSize: 30}}>👋</Text>
          </View>
          <Text
            style={styles.txtNewWorld}>{`Welcome to the \n New World.`}</Text>
          <Text style={styles.txtDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit ut in
            amet elit, dictum.
          </Text>
          <TouchableOpacity style={styles.btnExplore} onPress={onExplore}>
            <Text style={styles.txtBtnExplore}>Explore Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};
