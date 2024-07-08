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
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import {getDefaultAvatar} from 'helper/userHelpers';
import {SCREEN_WIDTH} from 'helper/utils';
import {DetailVerticalIcon, SearchIcon, WhiteMicIcon} from 'assets/svg';
import {apiGetSlambookMember} from 'helper/slambookHelper';

export const VoiceRoom = ({show, slambookId, roomName, roomToken, onClose}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [500, 500], []);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastRole, setLastRole] = useState('creator');
  const [lastId, setLastId] = useState(null);
  const [arrData, setArrData] = useState([]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
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
          {top: 16, left: 16, right: 16, bottom: 30},
        ]}>
        <View
          style={{
            width: '100%',
            height: 30,
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.title}>{roomName}</Text>
          <TouchableOpacity>
            <SearchIcon isActive={false} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: 30, alignItems: 'center', marginStart: 20}}>
            <DetailVerticalIcon color={'#000000'} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={Array(30).fill(0)}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View
              style={{
                width: 80,
                marginHorizontal: (SCREEN_WIDTH - 32 - 240) / 6,
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <Image
                source={getDefaultAvatar()}
                style={{width: 56, height: 56, borderRadius: 56}}
              />
              <Text style={styles.txtMemberName}>{'Alexandra'}</Text>
            </View>
          )}
          style={{width: '100%', marginTop: 20}}
          contentContainerStyle={{width: '100%'}}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                flex: 1,
                height: 42,
                borderRadius: 42,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.2)',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CloseIcon />
              <Text style={styles.txtLeaveRoom}>Leave Room</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                height: 42,
                borderRadius: 42,
                borderWidth: 1,
                borderColor: '#FF6651',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginStart: 20,
              }}>
              <UserIcon />
              <Text style={styles.txtInviteUser}>Invite Users</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{marginStart: 20}}>
            <MicIcon />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const CloseIcon = props => (
  <Svg width="17" height="16" fill="none" viewBox="0 0 17 16">
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.6"
      strokeWidth="1.5"
      d="M12.5 4l-8 8M4.5 4l8 8"></Path>
  </Svg>
);

const UserIcon = props => (
  <Svg width="17" height="16" fill="none" viewBox="0 0 17 16">
    <G
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      clipPath="url(#clip0_16201_24641)">
      <Path d="M11.167 14v-1.333A2.667 2.667 0 008.5 10H3.833a2.667 2.667 0 00-2.666 2.667V14M13.833 5.332v4M15.833 7.332h-4M6.167 7.333a2.667 2.667 0 100-5.333 2.667 2.667 0 000 5.333z"></Path>
    </G>
    <Defs>
      <ClipPath id="clip0_16201_24641">
        <Path fill="#fff" d="M0 0H16V16H0z" transform="translate(.5)"></Path>
      </ClipPath>
    </Defs>
  </Svg>
);

const MicIcon = () => (
  <Svg width="53" height="52" fill="none" viewBox="0 0 53 52">
    <Rect
      width="52"
      height="52"
      x="0.5"
      fill="url(#paint0_linear_16201_24643)"
      rx="26"></Rect>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M26.5 16.832a2.5 2.5 0 00-2.5 2.5v6.667a2.5 2.5 0 005 0v-6.667a2.5 2.5 0 00-2.5-2.5v0z"></Path>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M32.333 24.332v1.667a5.833 5.833 0 01-11.666 0v-1.667M26.5 31.832v3.333M23.167 35.168h6.666"></Path>
    <Defs>
      <LinearGradient
        id="paint0_linear_16201_24643"
        x1="10.9"
        x2="46.614"
        y1="8.125"
        y2="20.034"
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FF3F3F"></Stop>
        <Stop offset="1" stopColor="#FF701F"></Stop>
      </LinearGradient>
    </Defs>
  </Svg>
);
