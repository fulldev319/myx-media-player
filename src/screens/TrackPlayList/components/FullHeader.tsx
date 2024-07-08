import {useNavigation} from '@react-navigation/native';
import {PlayingStatus, useTracks} from 'contexts/TrackContext';
import {getDefaultBackground} from 'helper/userHelpers';
import React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BackIcon,
  BookMarkIcon,
  PauseRedIcon,
  PlayGrayIcon,
  PlayRedIcon,
} from './TrackPlayListIcons';

export const FullHeader = ({setHeaderHeight, info, togglePlay, playEnable}) => {
  const {goBack} = useNavigation();
  const {playlistId, playingStatus} = useTracks();
  return (
    <View
      style={styles.mainContainer}
      onLayout={event => {
        setHeaderHeight(event.nativeEvent.layout.height);
      }}>
      <View style={styles.background}>
        <ImageBackground
          style={styles.bgImage}
          resizeMode="cover"
          source={info?.image ? {uri: info?.image} : getDefaultBackground()}>
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.3)', 'rgba(0,0,0,1)']}
            style={styles.bgMask}
          />
        </ImageBackground>
      </View>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.left}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                goBack();
              }}>
              <BackIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={() => {}} style={styles.actionBtn}>
              <BookMarkIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{info?.title}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{info?.description}</Text>
            <TouchableOpacity onPress={togglePlay}>
              {!playEnable ? (
                <PlayGrayIcon />
              ) : playlistId === info.id &&
                playingStatus === PlayingStatus.Loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : playlistId === info.id &&
                playingStatus === PlayingStatus.Playing ? (
                <PauseRedIcon />
              ) : (
                <PlayRedIcon />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusBold}>
              {info?.trackNumber ?? 0} song • {info?.artistNumber ?? 0} artists
            </Text>
            <View style={styles.status}>
              {info?.creator?.handle && (
                <>
                  <Text style={styles.statusLight}>Created by </Text>
                  <Text style={styles.statusBold}>{info?.creator?.handle}</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  container: {
    width: '100%',
    minHeight: 300,
    paddingHorizontal: 26,
    paddingBottom: 20,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: 300,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  bgMask: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    width: '100%',
    marginTop: 65,
    flexDirection: 'row',
    paddingBottom: 20,
  },
  actionBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  left: {
    flex: 1,
  },
  right: {},
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginTop: 90,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 28,
    color: '#FFFFFF',
  },
  descriptionContainer: {
    marginTop: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    marginRight: 11,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    flex: 1,
  },
  statusContainer: {
    marginTop: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF33',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBold: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
  },
  statusLight: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF99',
  },
});
