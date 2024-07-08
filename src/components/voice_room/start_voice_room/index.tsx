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
import {getDefaultAvatar} from 'helper/userHelpers';
import {SCREEN_WIDTH} from 'helper/utils';
import {WhiteMicIcon} from 'assets/svg';
import {apiGetSlambookMember} from 'helper/slambookHelper';

export const StartVocieRoom = ({
  show,
  slambookId,
  onClose,
  onCreate,
  onSchedule,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [600, 600], []);

  const [roomName, setRoomName] = useState('');
  const [showPlaceHolder, setShowPlaceholder] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastRole, setLastRole] = useState('creator');
  const [lastId, setLastId] = useState(null);
  const [arrData, setArrData] = useState([]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
      setRoomName('');
      setShowPlaceholder(true);
    } else {
    }
  }, []);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
      loadData(true);
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  const loadData = async (isReload = false) => {
    if (!isLoading && hasMore) {
      setIsLoading(true);

      const res = await apiGetSlambookMember(slambookId, lastRole, lastId);

      if (res.success) {
        if (isReload) {
          setArrData(res.data);
        } else {
          setArrData(prev => [...prev, ...res.data]);
        }

        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setLastRole(res.lastRole);
      }
    }
    setIsLoading(false);
  };

  const onCreateRoom = () => {
    if (roomName !== '') {
      onCreate(roomName);
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
        <Text style={styles.title}>Start Voice Room</Text>
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
        <View style={styles.infoView}>
          <Text style={styles.txtInvite}>
            Members to Invite ({arrData.length})
          </Text>
          <Text style={styles.txtShowAll}>Show All</Text>
        </View>
        <FlatList
          data={arrData}
          numColumns={4}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View
              style={{
                marginHorizontal: (SCREEN_WIDTH - 32 - 240) / 8,
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <Image
                source={
                  item.image !== '' ? {uri: item.image} : getDefaultAvatar()
                }
                style={{width: 60, height: 60, borderRadius: 60}}
              />

              <Text style={styles.txtMemberName}>{item.name}</Text>
            </View>
          )}
          style={{width: '100%'}}
          contentContainerStyle={{width: '100%'}}
        />
        <TouchableOpacity
          style={styles.btnStartNowContainer}
          onPress={onCreateRoom}>
          <WhiteMicIcon />
          <Text style={styles.btnStartNowText}>Start Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnScheduleContainer}
          onPress={onSchedule}>
          <CalendarIcon />
          <Text style={styles.btnStartNowText}>Schedule for Later</Text>
        </TouchableOpacity>
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
      fill="#FF6651"
      d="M35.62 25.12c-.39 0-.7.31-.7.7v1.58c0 3.54-2.88 6.42-6.42 6.42s-6.42-2.88-6.42-6.42v-1.59c0-.39-.31-.7-.7-.7-.39 0-.7.31-.7.7v1.58c0 4.07 3.13 7.42 7.12 7.78v2.13c0 .39.31.7.7.7.39 0 .7-.31.7-.7v-2.13c3.98-.35 7.12-3.71 7.12-7.78v-1.58a.707.707 0 00-.7-.69z"></Path>
    <Path
      fill="#FF6651"
      d="M28.5 18c-2.44 0-4.42 1.98-4.42 4.42v5.12c0 2.44 1.98 4.42 4.42 4.42s4.42-1.98 4.42-4.42v-5.12c0-2.44-1.98-4.42-4.42-4.42zm1.31 6.95a.576.576 0 01-.71.41c-.39-.11-.8-.11-1.19 0-.32.09-.63-.1-.71-.41-.09-.31.1-.63.41-.71.59-.16 1.21-.16 1.8 0 .3.08.48.4.4.71zm.53-1.94a.58.58 0 01-.55.38c-.07 0-.13-.01-.2-.03-.7-.26-1.48-.26-2.18 0a.59.59 0 01-.75-.35c-.11-.3.05-.64.35-.74a4.36 4.36 0 012.98 0c.3.11.46.44.35.74z"></Path>
  </Svg>
);

const CalendarIcon = props => (
  <Svg width="18" height="18" fill="none" viewBox="0 0 18 18">
    <Path
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 3H3.75a1.5 1.5 0 00-1.5 1.5V15a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5zM2.25 7.5h13.5M12 1.5v3M6 1.5v3"></Path>
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
