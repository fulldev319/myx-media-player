/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import {useNavigation} from '@react-navigation/native';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {useTracks} from 'contexts/TrackContext';
import {eventListenDebate} from 'helper/socketHelper';
import {
  ClockIcon,
  SmallWaveIcon,
  ThreeDotIcon,
  MessageIcon,
  SmallAudioPlayIcon,
} from '../assets/svgs';
import {CustomBadge} from './CustomBadge';
import {SwipeoutBtn} from './SwipeoutBtn';

export interface Emolike {
  id: number;
  url: string;
}
export interface DebateThread {
  id: number;
  keywords: string;
  creator: {
    id: string;
    handle: string;
    name: string;
    image: string;
  };
  description: string;
  threads: number;
  duration: number;
  emolikes: Emolike[];
  url: string;
}

export interface ThreadProps {
  key: any;
  data: DebateThread;
  hidePost: (id: string) => void;
}

export const ThreadCard = (props: ThreadProps) => {
  const swipeRef = useRef<Swipeable>();
  const navigation = useNavigation();
  const {id, creator, keywords, description, threads, duration, emolikes, url} =
    props.data;
  const keywordsData = keywords?.split(',');
  const {user} = useSelector((state: RootState) => state.auth);
  const {togglePlayer, curTrack, playingStatus, playOneTrack, trackPosition} =
    useTracks();
  const [prevTrackPosition, setPrevTrackPosition] = useState(0);

  useEffect(() => {
    if (playingStatus === 'playing' && trackPosition - prevTrackPosition > 5) {
      setPrevTrackPosition(trackPosition);
      eventListenDebate({
        comment: curTrack?.id,
        user: user?.id,
        time: trackPosition,
      });
    }
  }, [trackPosition]);

  const rightButton = [
    <SwipeoutBtn onPress={() => props.hidePost(creator?.id)} />,
  ];

  const handlePressThread = () => {
    navigation.navigate('SubThreadPage', {id, url, keywords, description});
  };

  const handlePlayer = () => {
    if (String(curTrack?.id) === String(id)) {
      togglePlayer();
    } else {
      if (url) {
        playOneTrack(
          {
            id: String(id),
            image: '',
            title: keywords,
            artists: [''],
            description: description,
            url: url,
            previewUrl: url,
          },
          id,
          false,
        );
      }
    }
  };

  return (
    <Swipeable
      ref={swipeRef}
      rightButtons={rightButton}
      useNativeDriver={true}
      rightButtonWidth={120}>
      <TouchableOpacity style={styles.thread} onPress={handlePressThread}>
        <View style={styles.threadHeader}>
          <View style={styles.headerHeaderImage}>
            <Image
              source={{uri: creator.image}}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <Text style={styles.threadName}>{creator.name}</Text>
          <TouchableOpacity>
            <ThreeDotIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.rowItem}>
          {keywordsData?.map((item, index) => {
            return (
              <CustomBadge
                key={index}
                label={item}
                color="#ffffff20"
                containerStyle={styles.threadBadge}
                labelStyle={styles.threadBadgeLabel}
              />
            );
          })}
        </View>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.threadStatus}>
          <View style={styles.rowItem}>
            <ClockIcon />
            <Text style={styles.threadStatusText}>{duration}</Text>
          </View>
          <View style={[styles.rowItem, {marginLeft: 18}]}>
            <MessageIcon />
            <Text style={styles.threadStatusText}>{threads}</Text>
          </View>
        </View>

        <View style={styles.threadBottom}>
          <View style={styles.rowItem}>
            <View style={styles.threadAvatar}>
              <SmallWaveIcon />
            </View>
          </View>
          <TouchableOpacity
            style={styles.smallAudioPlayButton}
            onPress={handlePlayer}>
            <Text style={styles.smallAudioPlay}>Play Audio</Text>
            <SmallAudioPlayIcon />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export const styles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thread: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#94b3d130',
    marginTop: 12,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerHeaderImage: {
    width: 24,
    height: 24,
    backgroundColor: '#d9d9d9',
    borderRadius: 8,
  },
  threadName: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    marginLeft: 8,
    color: 'white',
  },
  threadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 32,
    marginRight: 8,
  },
  threadBadgeLabel: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16.8,
    color: '#ffffff80',
  },
  threadStatusText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#ffffff80',
    marginLeft: 4,
  },
  threadStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: '#ffffff20',
    borderBottomWidth: 1,
  },
  threadBottom: {
    paddingTop: 16,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  threadAvatar: {
    width: 24,
    height: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    marginRight: 6,
  },
  description: {
    marginTop: 8,
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 19.2,
    color: '#ffffff80',
  },
  descEmail: {
    marginTop: 8,
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 19.2,
    color: '#ff6651',
  },
  smallAudioPlayButton: {
    width: 90,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    backgroundColor: '#ff6651',
    paddingHorizontal: 10,
  },
  smallAudioPlay: {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
});
