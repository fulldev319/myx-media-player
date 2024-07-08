import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {CustomToast, PrimaryButton} from 'components/common';

import {styles} from './index.styles';
import Svg, {Path} from 'react-native-svg';
import {SnipAudio} from './SnipAudio';
import {apiSaveSnipAudio} from 'helper/fictionHelper';
import {useToast} from 'native-base';

export const SaveAudioToLibrary = ({
  debateId,
  totalDuration,
  show,
  onNext,
  onClose,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [450, 450], []);
  const [isTriming, setIsTriming] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(1);
  const toast = useToast();

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  const onUpdatedSelection = (startPro, endPro) => {
    setStartTime((totalDuration * startPro) / 100);
    setEndTime((totalDuration * endPro) / 100);
  };

  const save = async () => {
    setIsTriming(true);
    const res = await apiSaveSnipAudio(debateId, startTime, endTime);

    if (res.success) {
      toast.show({
        render: () => (
          <CustomToast
            title="Saved audio on your library"
            color="#08b883"
            hideButton={true}
          />
        ),
        placement: 'top',
      });

      sheetRef.current?.close();
      onClose();
    }
    setIsTriming(false);
  };

  const saveAndCreateEmoji = async () => {
    setIsTriming(true);
    const res = await apiSaveSnipAudio(debateId, startTime, endTime);

    if (res.success) {
      sheetRef.current?.close();
      onNext(startTime, endTime);
    }
    setIsTriming(false);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => {
            sheetRef.current?.close();
            onClose();
          }}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.txtTitle}>Save Audio to Library</Text>
      </View>
    );
  };

  const renderBottom = () => {
    return (
      <View style={{width: '100%', marginTop: 24}}>
        {isTriming ? (
          <View style={styles.btnSaveTxt}>
            <ActivityIndicator />
          </View>
        ) : (
          <TouchableOpacity style={styles.btnSave} onPress={save}>
            <Text style={styles.btnSaveTxt}>Save Audio</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.btnSaveAndCreate}
          onPress={saveAndCreateEmoji}>
          <Text style={styles.btnSaveAndCreateTxt}>
            Save and Create Emolike
          </Text>
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
      enablePanDownToClose={false}
      enableDismissOnClose={true}
      onDismiss={onClose}>
      <View style={[StyleSheet.absoluteFill]}>
        <View style={styles.body}>
          {renderHeader()}
          <View style={{width: '100%', marginTop: 20}}>
            <SnipAudio
              totalDuration={totalDuration}
              onUpdated={onUpdatedSelection}
            />
          </View>
          {renderBottom()}
        </View>
      </View>
    </BottomSheetModal>
  );
};

const BackIcon = () => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 18l-6-6 6-6"></Path>
  </Svg>
);
