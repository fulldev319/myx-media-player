import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Image, TouchableOpacity, Text, View, Platform} from 'react-native';
import {RootState} from 'redux/interfaces';

import {DetailIcon, DislikeIcon, LikeIcon} from 'assets/svg';
import {styles} from './index.styles';
import {musicDaoLikeSongNFT} from 'helper/musicDaoHelpers';
import Svg, {LinearGradient, Path} from 'react-native-svg';
import SelectDropdown from 'react-native-select-dropdown';
import actions from 'redux/media/actions';
import {savePlayedSongLocal} from 'helper/userHelpers';

export const SongItem = ({data, onShare, onAddToPlaylist}: SongItemProps) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [handlingLike, setHandlingLike] = useState<boolean>(false);
  const dropDownRef = useRef<SelectDropdown>(null);
  const detailActions = ['share', 'add'];

  const [isPlaying, setIsPlaying] = useState(false);

  const {mediaPlayerVisible, selectedMediaId} = useSelector(
    (state: RootState) => state.media,
  );

  const clickPlayer = item => {
    dispatch(actions.selectMedia(item));
  };

  const onPlayMusic = async () => {
    clickPlayer(data);
    await onAddToRecentPlayed();
  };

  const onAddToRecentPlayed = async () => {
    await savePlayedSongLocal(data);
  };

  useEffect(() => {
    const mediaId = data?.id ? data?.id : data?.Id ? data?.Id : data?.url;
    if (mediaPlayerVisible && selectedMediaId && selectedMediaId === mediaId) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [mediaPlayerVisible, selectedMediaId]);

  useEffect(() => {
    if (data && data.likes && user?.id) {
      if (data.likes?.find(f => f.userId === user.id)) {
        setIsLiked(false);
      } else {
        setIsLiked(true);
      }
    } else {
      setIsLiked(true);
    }
  }, [data, user]);

  const onHandLike = async (actionType: string) => {
    if (handlingLike) return;

    if (actionType === 'like') {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }

    try {
      setHandlingLike(true);
      const res: any = await musicDaoLikeSongNFT(
        user.id,
        data.Id,
        actionType === 'like' ? 'dislike' : 'like',
      );
      if (res?.success) {
      } else {
        if (actionType === 'like') {
          setIsLiked(false);
        } else {
          setIsLiked(true);
        }
      }
      setHandlingLike(false);
    } catch (error) {
      setHandlingLike(false);
      if (actionType === 'like') {
        setIsLiked(false);
      } else {
        setIsLiked(true);
      }
    }
  };

  const onHandleShare = () => {
    onShare && onShare(data);
  };

  const onHandleAddPlaylist = () => {
    onAddToPlaylist && onAddToPlaylist(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image
          source={{uri: data.ImageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
        {isPlaying && (
          <View style={styles.imagePlaying}>
            <WaveIcon />
          </View>
        )}
      </View>
      <TouchableOpacity onPress={onPlayMusic} style={styles.content}>
        <Text
          style={{...styles.title, color: isPlaying ? '#F6943D' : '#FFFFFF'}}
          numberOfLines={1}
          ellipsizeMode="tail">
          {data.Name}
        </Text>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {data.Artist}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        {isLiked ? (
          <TouchableOpacity
            onPress={() => {
              onHandLike('dislike');
            }}>
            <DislikeIcon />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              onHandLike('like');
            }}>
            <LikeIcon />
          </TouchableOpacity>
        )}
        <SelectDropdown
          ref={dropDownRef}
          data={detailActions}
          onSelect={(selectedItem, index) => {
            if (index === 0) {
              onHandleShare();
            } else {
              onHandleAddPlaylist();
            }
          }}
          defaultButtonText={' '}
          buttonTextAfterSelection={(selectedItem, index) => {
            return '';
          }}
          rowTextForSelection={(selectedItem, index) => {
            return '';
          }}
          buttonStyle={{
            backgroundColor: 'transparent',
            width: 40,
          }}
          dropdownStyle={{
            marginTop: -10,
            marginLeft: -140,
            backgroundColor: '#232323',
            padding: 16,
            borderColor: 'red',
            borderRadius: 8,
            width: 180,
            height: 92,
          }}
          rowStyle={{
            borderBottomWidth: 0,
            height: 30,
          }}
          renderDropdownIcon={() => (
            <TouchableOpacity
              onPress={() => {
                dropDownRef?.current?.openDropdown();
              }}>
              <DetailIcon />
            </TouchableOpacity>
          )}
          renderCustomizedRowChild={(item, index) => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              {item.toString() === 'share' ? (
                <ShareIcon size={17} />
              ) : (
                <AddMusicIcon />
              )}
              <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={{
                  fontFamily:
                    Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 12,
                  textAlign: 'left',
                  color: '#FFFFFF',
                  marginHorizontal: 0,
                  textAlignVertical: 'center',
                  marginLeft: 13,
                }}>
                {item.toString() === 'share' ? 'Share' : 'Add to playlist'}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

type SongItemProps = {
  data: any;
  isPlaying?: boolean;
  playEvent?: () => void;
  onShare?: Function;
  onAddToPlaylist?: Function;
};

const WaveIcon = props => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M14.2861 23.6974V12.0308"
      stroke="#F6943D"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.9526 23.6973L18.9526 7.36401"
      stroke="#F6943D"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M23.6191 23.6973L23.6191 14.364"
      stroke="#F6943D"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.61914 23.6974V5.03076"
      stroke="#F6943D"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.78613 23.6973V16.6973"
      stroke="#F6943D"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ShareIcon = props => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M4.95136 9.93075C5.76506 9.93075 6.42469 9.29013 6.42469 8.49992C6.42469 7.7097 5.76506 7.06909 4.95136 7.06909C4.13766 7.06909 3.47803 7.7097 3.47803 8.49992C3.47803 9.29013 4.13766 9.93075 4.95136 9.93075Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.0915 4.95835C12.8817 4.95835 13.5223 4.31774 13.5223 3.52751C13.5223 2.73728 12.8817 2.09668 12.0915 2.09668C11.3013 2.09668 10.6606 2.73728 10.6606 3.52751C10.6606 4.31774 11.3013 4.95835 12.0915 4.95835Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.0915 14.9034C12.8817 14.9034 13.5223 14.2628 13.5223 13.4726C13.5223 12.6824 12.8817 12.0417 12.0915 12.0417C11.3013 12.0417 10.6606 12.6824 10.6606 13.4726C10.6606 14.2628 11.3013 14.9034 12.0915 14.9034Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.53809 7.39506L10.5047 4.63257"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.5047 12.3675L6.53809 9.60498"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AddMusicIcon = props => (
  <Svg
    width={15}
    height={15}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M5.3335 12.278V2.88903L14.0002 1.44458V10.8335"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.33335 12.278C5.33335 12.7065 5.20628 13.1254 4.9682 13.4817C4.73012 13.8381 4.39173 14.1158 3.99583 14.2797C3.59992 14.4437 3.16427 14.4866 2.74398 14.403C2.32368 14.3194 1.93762 14.1131 1.63461 13.8101C1.33159 13.5071 1.12523 13.121 1.04163 12.7007C0.958031 12.2804 1.00094 11.8448 1.16493 11.4489C1.32892 11.0529 1.60663 10.7146 1.96294 10.4765C2.31924 10.2384 2.73815 10.1113 3.16668 10.1113C3.74131 10.1113 4.29242 10.3396 4.69875 10.7459C5.10508 11.1523 5.33335 11.7034 5.33335 12.278V12.278Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.9999 10.8334C13.9999 11.262 13.8728 11.6809 13.6347 12.0372C13.3966 12.3935 13.0582 12.6712 12.6623 12.8352C12.2664 12.9992 11.8308 13.0421 11.4105 12.9585C10.9902 12.8749 10.6041 12.6685 10.3011 12.3655C9.99809 12.0625 9.79174 11.6764 9.70814 11.2561C9.62454 10.8358 9.66744 10.4002 9.83143 10.0043C9.99542 9.60836 10.2731 9.26998 10.6294 9.0319C10.9857 8.79382 11.4047 8.66675 11.8332 8.66675C12.4078 8.66675 12.9589 8.89502 13.3652 9.30135C13.7716 9.70768 13.9999 10.2588 13.9999 10.8334Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.33324 5.7778C6.92873 5.7778 8.22214 4.4844 8.22214 2.8889C8.22214 1.2934 6.92873 0 5.33324 0C3.73774 0 2.44434 1.2934 2.44434 2.8889C2.44434 4.4844 3.73774 5.7778 5.33324 5.7778Z"
      fill="white"
    />
    <Path d="M5.3335 1.44458V4.33348" stroke="#150C07" strokeLinecap="round" />
    <Path d="M6.77783 2.88916H3.88893" stroke="#150C07" strokeLinecap="round" />
  </Svg>
);
