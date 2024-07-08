import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {StackScreenProps} from '@react-navigation/stack';
import {RoundCloseIcon} from 'assets/svg';
import {MainStackParams} from 'navigators';
import ProgressBar from 'react-native-animated-progress';
import SelectMedia from './SelectMedia';
import {PlayButton} from 'screens/MusicPlayer/components/PlayButton';
import {apiTrackGet} from 'helper/trackHelpers';
import {compressMedia} from 'helper/utils';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {useDispatch} from 'react-redux';
import memoryAction from 'redux/memory/actions';
import {MapServices} from 'screens/map/services';
import {useFocusEffect} from '@react-navigation/native';
import {GetData, Keys, SetData} from 'screens/map/storagemanager';
import {LocationPermission} from 'screens/map/components';
import {PlayingStatus, useTracks} from 'contexts/TrackContext';

export const AddMemoryPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();
  const {curTrack, togglePlayer, playingStatus, trackProgress, playOneTrack} =
    useTracks();

  const {songId} = route.params!;
  const [isLoading, setIsLoading] = useState(false);
  const [songData, setSongData] = useState(null);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    LONGITUDE: 0,
    LATITUDE: 0,
  });

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const clean =
        Platform.OS === 'android'
          ? getLocationPermission()
          : getCurrentLocation();
      return () => clean;
    }, []),
  );

  useEffect(() => {
    if (songId) {
      getTrackData();
    }
  }, [songId]);

  const getCurrentLocation = () => {
    MapServices.getCurrentLocation()
      .then((res: any) => {
        if (res) {
          const {coords} = res;
          const {latitude, longitude} = coords;
          setCurrentLocation({LONGITUDE: longitude, LATITUDE: latitude});
        }
      })
      .catch(() => {});
  };

  const getLocationPermission = () => {
    GetData(Keys.LOCATION_PERMISSION).then(data => {
      console.log(`location permission status`, data);
      if (data && data === 'denied') {
        setShowPermissionModal(true);
      } else if (data && data === 'granted') {
        getCurrentLocation();
      } else if (!data) {
        MapServices.locationPermission().then(res => {
          if (res === 'denied') {
            SetData(Keys.LOCATION_PERMISSION, 'denied');
            setShowPermissionModal(true);
          } else if (res === 'granted') {
            getCurrentLocation();
          }
        });
      }
    });
  };

  const onSkipPress = () => setShowPermissionModal(false);
  const onAllowPress = () => {
    MapServices.locationPermission().then(data => {
      if (data === 'denied') {
        SetData(Keys.LOCATION_PERMISSION, 'neverAskAgain');
        setShowPermissionModal(false);
      } else {
        setShowPermissionModal(false);
        getCurrentLocation();
      }
    });
  };

  const getTrackData = async () => {
    apiTrackGet(songId).then(res => {
      if (res.success) {
        setSongData(res.data);
      }
    });
  };

  const onGoToSubmitMemory = async (mediaUri, mediaType, duration) => {
    const data = {
      videoUri: mediaUri,
      mediaType,
      videoDuration: duration,
      songId,
      location: [currentLocation.LONGITUDE, currentLocation.LATITUDE],
    };
    getMediaURL(data)
      .then(res => {
        dispatch(memoryAction.addMediaUrl({...data, ipfsURL: res}));
      })
      .catch(err => {
        console.log('error to upload asset to ipfs', err);
      });

    navigation.navigate('MemorySubmitPage', [data]);
  };

  const onTextSubmitMemory = async text => {
    dispatch(
      memoryAction.addMediaUrl({
        ipfsURL: text,
        mediaType: 'text',
        videoUri: text,
        videoDuration: 0,
        songId,
        location: [currentLocation.LONGITUDE, currentLocation.LATITUDE],
      }),
    );

    navigation.navigate('MemorySubmitPage', [
      {
        mediaType: 'text',
        videoUri: text,
        videoDuration: 0,
        songId,
        location: [currentLocation.LONGITUDE, currentLocation.LATITUDE],
      },
    ]);
  };

  const checkCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission !== 'authorized') {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission !== 'authorized') {
        onClose();
      }
    }
  };

  const onClose = () => {
    navigation.pop();
  };

  const onGoToGallery = mediaType => {
    navigation.navigate('MemoryVideoGalleryPage', {
      mediaType,
      songId,
      location: [currentLocation.LONGITUDE, currentLocation.LATITUDE],
    });
  };

  const getMediaURL = async media => {
    let base64String;
    if (media.mediaType !== 'text') {
      base64String = await compressMedia(media.mediaType, media.videoUri);
      base64String = await getBase64String(base64String);
    }

    const mediaUrl =
      media.mediaType === 'text'
        ? media.videoUri
        : await uploadFileToIPFS(
            base64String,
            media.mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
          );

    return mediaUrl;
  };

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
        songId,
      );
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <RoundCloseIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Add Memory</Text>
      </View>
      <View style={{paddingHorizontal: 24, marginTop: 16}}>
        <View style={styles.miniPlayer}>
          <Image
            source={{uri: songData && songData?.image ? songData?.image : ''}}
            style={styles.songImage}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text
              style={styles.songTitle}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {songData && songData.title ? songData.title : ''}
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
              curTrack?.id === songData?.id
                ? playingStatus
                : PlayingStatus.Pause
            }
            onClick={handlePlay}
            progressValue={curTrack?.id === songData?.id ? trackProgress : 0}
          />
        </View>
      </View>
      <View style={styles.body}>
        <SelectMedia
          onGoToGallery={onGoToGallery}
          onGoToSubmitMemory={onGoToSubmitMemory}
          onTextMemoryNext={onTextSubmitMemory}
        />
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.waitText}>Please Wait...</Text>
          <View style={{width: '80%', marginTop: 20}}>
            <ProgressBar
              height={3}
              indeterminate
              backgroundColor="rgba(255, 255, 255, 1)"
            />
          </View>
        </View>
      )}
      {showPermissionModal && (
        <LocationPermission
          onAllowPress={onAllowPress}
          onSkipPress={onSkipPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    marginTop: 36,
    marginHorizontal: 26,
  },
  title: {
    position: 'absolute',
    left: 50,
    right: 50,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  body: {
    flex: 1,
    marginTop: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(1, 1, 1, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  miniPlayer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  content: {
    paddingHorizontal: 12,
    flex: 1,
  },
  songTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
  },
  description: {
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
});
