import {PlayingStatus, useTracks} from 'contexts/TrackContext';
import {convertTimeFormat} from 'helper/utils';
import React, {useRef} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Svg, {Path} from 'react-native-svg';
import {
  MiniPauseIcon,
  MiniPlayIcon,
} from 'screens/MusicPlayer/components/musicPlayerIcons';
import Swipeable from 'react-native-swipeable-row';

export const MusicTrackCard = ({
  data,
  onDelete,
  togglePlay,
  style = {},
  isOwn = false,
}) => {
  const {curTrack, playingStatus} = useTracks();
  const swipeRef = useRef<Swipeable>();

  const rightButtons = [
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[styles.bgAction, styles.delete]}
        onPress={() => {
          onDelete();
          swipeRef?.current?.recenter();
        }}>
        <DeleteIcon />
        <Text style={styles.txtAction}>Delete</Text>
      </TouchableOpacity>
    </View>,
  ];

  return (
    <Swipeable
      ref={swipeRef}
      style={styles.root}
      disable={!isOwn}
      rightButtons={rightButtons}
      useNativeDriver={true}
      rightButtonWidth={94}>
      <TouchableOpacity onPress={togglePlay} style={[styles.container, style]}>
        <Image source={{uri: data.item.image}} style={styles.image} />
        <View style={styles.songInfoContainer}>
          <Text style={styles.txtDuration}>
            {convertTimeFormat(data.item.duration)}
          </Text>
          <Text style={styles.txtName} ellipsizeMode="tail" numberOfLines={1}>
            {data.item.title}
          </Text>
          <Text style={styles.txtDesc} ellipsizeMode="tail" numberOfLines={1}>
            {data.item.artists ? data.item.artists[0] : ''}
          </Text>
        </View>
        <View style={styles.playIcon}>
          {curTrack?.id === data.item.id ? (
            playingStatus === PlayingStatus.Loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : playingStatus === PlayingStatus.Playing ? (
              <MiniPauseIcon />
            ) : (
              <MiniPlayIcon />
            )
          ) : (
            <PlayIcon />
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    height: '100%',
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
    marginLeft: 26,
  },
  bgAction: {
    width: 68,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  edit: {
    backgroundColor: '#FF6651',
  },
  delete: {
    backgroundColor: '#FFFFFF33',
  },
  txtAction: {
    marginTop: 8,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
  },
  container: {
    width: '100%',
    height: 72,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  txtDuration: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  txtName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playIcon: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const PlayIcon = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fill="#fff"
      d="M12 2c5.512 0 10 4.486 10 10.006C22 17.514 17.512 22 12 22S2 17.514 2 12.006C2 6.486 6.488 2 12 2zm-1.139 6.03c-.212 0-.415.048-.608.145a1.251 1.251 0 00-.54.598c-.068.173-.174.694-.174.704-.107.57-.164 1.495-.164 2.518 0 .976.057 1.862.144 2.441.01.01.116.656.232.878.212.405.627.656 1.071.656h.039c.29-.01.898-.26.898-.27 1.023-.425 3.04-1.746 3.851-2.624l.058-.058c.106-.106.241-.27.27-.309.155-.202.232-.453.232-.703 0-.281-.087-.542-.251-.754-.039-.038-.184-.202-.319-.337-.791-.85-2.857-2.239-3.938-2.663-.164-.067-.579-.212-.801-.222z"
      opacity="0.3"
    />
  </Svg>
);

const DeleteIcon = props => (
  <Svg
    width={20}
    height={21}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M2.5 5.5H4.16667H17.5"
      stroke="white"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.8333 5.50002V17.1667C15.8333 17.6087 15.6577 18.0326 15.3451 18.3452C15.0326 18.6578 14.6087 18.8334 14.1666 18.8334H5.83329C5.39127 18.8334 4.96734 18.6578 4.65478 18.3452C4.34222 18.0326 4.16663 17.6087 4.16663 17.1667V5.50002M6.66663 5.50002V3.83335C6.66663 3.39133 6.84222 2.9674 7.15478 2.65484C7.46734 2.34228 7.89127 2.16669 8.33329 2.16669H11.6666C12.1087 2.16669 12.5326 2.34228 12.8451 2.65484C13.1577 2.9674 13.3333 3.39133 13.3333 3.83335V5.50002"
      stroke="white"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
