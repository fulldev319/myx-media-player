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
import DatePicker from 'react-native-date-picker';
import {useCallback, useMemo, useRef} from 'react';

import {styles} from './index.styles';
import Svg, {Circle, Path, Rect} from 'react-native-svg';
import {SCREEN_WIDTH} from 'helper/utils';

export const ScheduleVoiceRoom = ({show, onClose, onCreate}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [550, 550], []);

  const [roomName, setRoomName] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
      setRoomName('');
    } else {
    }
  }, []);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
      setDate(new Date());
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  const onCreateRoom = () => {
    if (roomName !== '') {
      onCreate(roomName, date.getTime());
    }
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
      <View
        style={[
          StyleSheet.absoluteFill,
          {top: 16, left: 16, right: 16, bottom: 30, alignItems: 'center'},
        ]}>
        <MicIcon />
        <Text style={styles.title}>Schedule Voice Room</Text>
        <View
          style={{
            width: '100%',
            height: 64,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            flexDirection: 'row',
            marginVertical: 24,
          }}>
          <View
            style={{
              width: 56,
              height: '100%',
              borderRightWidth: 1,
              borderRightColor: 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EditIcon />
          </View>
          <View style={{flex: 1, height: '100%', padding: 12}}>
            <Text style={styles.txtRoomTopic}>Room Topic</Text>
            <BottomSheetTextInput
              value={roomName}
              onChangeText={text => setRoomName(text)}
              maxLength={140}
              multiline={false}
              placeholder={'Enter room name here...'}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={styles.addTopicInput}
            />
          </View>
        </View>
        <View style={{width: '100%'}}>
          <Text style={styles.txtStartTime}>Start Time</Text>
          <View
            style={{
              width: '100%',
              height: 150,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 8,
              flexDirection: 'row',
              marginTop: 16,
            }}>
            <DatePicker
              date={date}
              onDateChange={setDate}
              textColor="#FFFFFF"
              dividerHeight={0}
              style={{height: 150, width: SCREEN_WIDTH - 50}}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 24}}>
          <TouchableOpacity
            style={styles.btnScheduleContainer}
            onPress={onClose}>
            <Text style={styles.btnStartNowText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnStartNowContainer}
            onPress={onCreateRoom}>
            <Text style={styles.btnStartNowText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const MicIcon = props => (
  <Svg width="57" height="56" fill="none" viewBox="0 0 57 56">
    <Rect
      width="56"
      height="56"
      x="0.5"
      fill="#FF6651"
      fillOpacity="0.2"
      rx="28"></Rect>
    <Circle
      cx="28.5"
      cy="27.5"
      r="19.5"
      fill="#FF6651"
      fillOpacity="0.2"></Circle>
    <Path
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M36 20H22a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V22a2 2 0 00-2-2zM20 26h18M33 18v4M25 18v4"></Path>
  </Svg>
);

const EditIcon = props => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <Path
      fill="#fff"
      d="M5 18.002h4.24a1 1 0 00.71-.29l6.92-6.93 2.84-2.78a1 1 0 000-1.42l-4.24-4.29a1 1 0 00-1.42 0l-2.82 2.83-6.94 6.93a.999.999 0 00-.29.71v4.24a1 1 0 001 1zm9.76-13.59l2.83 2.83-1.42 1.42-2.83-2.83 1.42-1.42zM6 13.172l5.93-5.93 2.83 2.83-5.93 5.93H6v-2.83zm15 6.83H3a1 1 0 100 2h18a1 1 0 000-2z"
      opacity="0.4"></Path>
  </Svg>
);
