import {PlayingStatus} from 'contexts/TrackContext';
import {getDefaultAvatar} from 'helper/userHelpers';
import {timeFormatDDMMHHMMSS, SCREEN_WIDTH} from 'helper/utils';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import PlayingWave from '../assets/svgs/PlayingWave';

export const CardUploadedAudio = ({
  data,
  currentAudioId,
  playingStatus,
  selectedAudio,
  onPlay,
  onSelected,
}) => {
  const toogleSelect = () => {
    onSelected(data);
  };

  const renderStatusIcon = () => {
    if (currentAudioId === data.id && playingStatus === PlayingStatus.Playing) {
      return <PlayingWave />;
    } else if (
      currentAudioId === data.id &&
      playingStatus === PlayingStatus.Loading
    ) {
      return <ActivityIndicator size={5} color={'white'} />;
    } else {
      return <PlayIcon />;
    }
  };

  const renderPlayBtn = () => {
    return (
      <TouchableOpacity
        style={styles.btnPlay}
        onPress={() => {
          onPlay(data);
        }}>
        {renderStatusIcon()}
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={
              data.image === '' || data.image === undefined
                ? getDefaultAvatar()
                : {uri: data.image}
            }
            style={{width: 20, height: 20, borderRadius: 20}}
          />
          <Text style={styles.desc}>{data.username}</Text>
        </View>
        <View style={styles.tagContainer}>
          {data.keywords.split(',').map((item, index) => {
            return (
              <View
                style={[
                  styles.tagItem,
                  selectedAudio !== null &&
                    selectedAudio.id === data.id && {backgroundColor: 'white'},
                ]}
                key={`recommended_post_1_${index}`}>
                <Text style={styles.txtTagItem}>{item}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.dateTime}>
          {timeFormatDDMMHHMMSS(data.timestamp)}
        </Text>
        {selectedAudio !== null && selectedAudio.id === data.id ? (
          <TouchableOpacity style={styles.btnSelect} onPress={toogleSelect}>
            <Text style={styles.btnSelectTxt}>Selected</Text>
            <SelectedIcon />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btnDefaultSelect}
            onPress={toogleSelect}>
            <Text style={styles.btnDefaultSelectTxt}>Select</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View
      style={
        selectedAudio !== null && selectedAudio.id === data.id
          ? styles.selectedContainer
          : styles.container
      }>
      {renderBody()}
      {renderPlayBtn()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (SCREEN_WIDTH - 48 - 8) / 2,
    height: 160,
    backgroundColor: '#F3F4F5',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 64,
    borderBottomRightRadius: 10,
    marginTop: 8,
  },
  selectedContainer: {
    width: (SCREEN_WIDTH - 48 - 8) / 2,
    height: 160,
    backgroundColor: 'rgba(255, 102, 81, 0.2)',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 64,
    borderBottomRightRadius: 10,
    borderColor: '#FF6651',
    borderWidth: 1,
    marginTop: 8,
  },
  markAwardedContainer: {
    position: 'absolute',
    right: 0,
    top: 24,
    height: 22,
    width: 67,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4E7FE',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 4,
    marginEnd: -7,
    paddingHorizontal: 5,
  },
  txtAwarded: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: '#9214F5',
    marginStart: 4,
  },
  btnPlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: '#FF6651',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginTop: 10,
  },
  desc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '400',
    color: '#010101',
    marginStart: 8,
  },
  dateTime: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '400',
    color: '#010101',
    opacity: 0.4,
    marginTop: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    flex: 1,
  },
  tagItem: {
    backgroundColor: 'rgba(1, 1, 1, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 30,
    marginEnd: 4,
    marginTop: 4,
  },
  txtTagItem: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '500',
    color: '#010101',
    opacity: 0.6,
  },
  postContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  postItem: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginEnd: 2,
  },
  btnDefaultSelect: {
    width: '100%',
    height: 30,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnDefaultSelectTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: '#FF6651',
  },
  btnSelect: {
    width: '100%',
    height: 30,
    borderRadius: 30,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  btnSelectTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    marginEnd: 8,
  },
});

const PlayIcon = () => (
  <Svg width="32" height="32" fill="none" viewBox="0 0 32 32">
    <Rect width="32" height="32" fill="#FF6651" rx="16"></Rect>
    <Path
      fill="#fff"
      d="M20.36 13.999l-6.44-3.694a2.28 2.28 0 00-3.42 2v7.414a2.28 2.28 0 003.42 1.973L20.36 18a2.28 2.28 0 000-3.947V14zm-.666 2.793l-6.44 3.747a.96.96 0 01-.947 0 .947.947 0 01-.473-.82v-7.44a.946.946 0 011.42-.82l6.44 3.72a.947.947 0 010 1.64v-.027z"></Path>
  </Svg>
);

const SelectedIcon = () => (
  <Svg width="13" height="12" fill="none" viewBox="0 0 13 12">
    <Path
      fill="#fff"
      d="M8.11 4.395l-2.145 2.15-.825-.825a.5.5 0 10-.705.705l1.175 1.18a.5.5 0 00.705 0l2.5-2.5a.5.5 0 10-.705-.71zM6.75 1a5 5 0 100 10 5 5 0 000-10zm0 9a4 4 0 110-8 4 4 0 010 8z"></Path>
  </Svg>
);
