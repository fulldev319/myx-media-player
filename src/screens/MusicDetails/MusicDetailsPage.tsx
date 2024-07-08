/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {MainStackParams} from 'navigators';
import {ArrowBack} from 'assets/svg';
import {PlayButton} from 'screens/MusicPlayer/components/PlayButton';
import {PlayingStatus, useTracks} from 'contexts/TrackContext';
import {MemoriesTab} from './components/MemoriesTab';
import {RelatedSongTab} from './components/RelatedSongTab';

const MusicDetailsPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const songData = route.params!;
  const {togglePlayer, curTrack, playingStatus, trackProgress, playOneTrack} =
    useTracks();

  const [selectedTab, setSelectedTab] = useState(0);

  const handlePlay = () => {
    if (curTrack?.id === songData?.id) {
      togglePlayer();
    } else {
      playOneTrack(
        {
          ...songData,
          url: songData?.previewUrl,
          previewUrl: songData?.previewUrl,
        },
        songData.id,
      );
    }
  };

  return (
    <View style={styles.body}>
      <LinearGradient
        colors={['#FF3F3F', '#FF701F10']}
        style={{
          position: 'absolute',
          height: 300,
          top: 0,
          left: 0,
          width: '120%',
          opacity: 0.5,
        }}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 45,
          left: 24,
          padding: 4,
          zIndex: 1,
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <ArrowBack />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Music</Text>
      </View>
      <View style={styles.miniPlayer}>
        <Image
          source={{uri: songData.image}}
          style={styles.songImage}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.songTitle} ellipsizeMode="tail" numberOfLines={1}>
            {songData.title}
          </Text>
          <Text
            style={styles.description}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {songData && songData.artists ? songData.artists[0] : ''}
          </Text>
        </View>
        <PlayButton
          playingStatus={
            curTrack?.id === songData.id ? playingStatus : PlayingStatus.Pause
          }
          onClick={handlePlay}
          progressValue={curTrack?.id === songData.id ? trackProgress : 0}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: '#ffffff20',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          width: '100%',
          marginTop: 24,
        }}>
        <TouchableOpacity
          style={{
            width: '45%',
            paddingBottom: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomColor: selectedTab === 0 ? '#FF6651' : 'unset',
            borderBottomWidth: selectedTab === 0 ? 3 : 0,
            borderStyle: 'solid',
          }}
          onPress={() => setSelectedTab(0)}>
          <Text
            style={{
              color: selectedTab === 0 ? '#FF6651' : '#ffffff90',
              fontSize: 14,
              fontWeight: selectedTab === 0 ? '500' : '400',
            }}>
            Memories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '55%',
            paddingBottom: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomColor: selectedTab === 1 ? '#FF6651' : 'unset',
            borderBottomWidth: selectedTab === 1 ? 3 : 0,
            borderStyle: 'solid',
          }}
          onPress={() => setSelectedTab(1)}>
          <Text
            style={{
              color: selectedTab === 1 ? '#FF6651' : '#ffffff90',
              fontSize: 14,
              fontWeight: selectedTab === 1 ? '500' : '400',
            }}>
            Related Song
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        {selectedTab === 0 ? (
          <MemoriesTab track={songData} />
        ) : (
          <RelatedSongTab trackId={songData.id} />
        )}
      </View>
    </View>
  );
};

export default MusicDetailsPage;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 24,
    fontFamily: 'Poppins',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 25,
    width: '100%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  miniPlayer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 16,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  songTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 12,
    flex: 1,
  },
  description: {
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  ownerImage: {
    width: 24,
    height: 24,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  tabContainer: {flex: 1},
});
