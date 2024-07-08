import {
  MUSIC_BRANCH,
  PlayingStatus,
  Track,
  useTracks,
} from 'contexts/TrackContext';
import {convertTimeFormat} from 'helper/utils';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import {
  MiniPauseIcon,
  MiniPlayIcon,
  PlayIcon,
} from 'screens/MusicPlayer/components/musicPlayerIcons';

const MyMusicItem = ({data, togglePlay}) => {
  const {curTrack, playingStatus} = useTracks();

  const renderTopView = () => {
    return (
      <View style={styles.topView}>
        <MusicIcon />
        <View style={styles.musicInfo}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.artistName}>{data.artists[0]}</Text>
        </View>
        <View style={styles.actionView}>
          <Text style={styles.durationTxt}>
            {convertTimeFormat(data.duration)}
          </Text>
          <TouchableOpacity onPress={() => togglePlay(data)}>
            {curTrack?.id === data.id ? (
              playingStatus === PlayingStatus.Loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : playingStatus === PlayingStatus.Playing ? (
                <MiniPauseIcon />
              ) : (
                <MiniPlayIcon />
              )
            ) : (
              <PlayIcon size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBottomView = () => {
    return (
      <View style={styles.bottomView}>
        <View>
          <Text style={styles.subTitle}>Listeners</Text>
          <Text style={styles.subDesc}>234,234 / mo</Text>
        </View>
        <View>
          <Text style={styles.subTitle}>Memories</Text>
          <Text style={styles.subDesc}>234,234 memories</Text>
        </View>
        <Text style={styles.txtSeeMemories}>See Memories</Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderTopView()}
      {/* <View style={styles.divider} /> */}
      {/* {renderBottomView()} */}
    </View>
  );
};

export default MyMusicItem;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    // height: 130,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  topView: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  musicInfo: {
    flex: 1,
    marginStart: 8,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  artistName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginEnd: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  bottomView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  subDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  txtSeeMemories: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#ff6651',
  },
});

const MusicIcon = props => (
  <Svg width="36" height="36" fill="none" viewBox="0 0 36 36">
    <Rect width="36" height="36" fill="#fff" fillOpacity="0.15" rx="12"></Rect>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      d="M16 22v-8.667L24 12v8.667"></Path>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      d="M14 24a2 2 0 100-4 2 2 0 000 4zM22 22.667a2 2 0 100-4 2 2 0 000 4z"></Path>
  </Svg>
);
