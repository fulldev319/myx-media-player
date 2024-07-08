import {ArrowRightIcon, FlashIcon, SwitchCameraIcon} from 'assets/svg';
import {convertTimeFormat} from 'helper/utils';
import React, {useRef, useCallback, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Image,
  Platform,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {CaptureButton} from './CaptureButton';

type MediaVideoSelectorProps = {
  onGoToGallery: Function;
  onGoToPublish: Function;
};

const MediaVideoSelector = ({
  onGoToGallery,
  onGoToPublish,
}: MediaVideoSelectorProps) => {
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [galleryVideoList, setGalleryVideoList] = useState([]);

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  useEffect(() => {
    hasAndroidPermission();
  }, []);

  const hasAndroidPermission = async () => {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      loadVideosFromLocal();
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const loadVideosFromLocal = async () => {
    const videos = await CameraRoll.getPhotos({
      first: 4,
      assetType: 'Videos',
      include: ['playableDuration'],
    });
    setGalleryVideoList(videos.edges);
  };

  const onSwitchCamera = () => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  };

  const onSwitchFlash = () => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  };

  const onRecordingSecond = seconds => {
    setRecordingSeconds(seconds);
  };

  const onGoToPublishStory = itemData => {
    onGoToPublish(
      itemData.node.image.uri,
      itemData.node.image.playableDuration,
    );
  };

  const onFinishRecord = (videoUri, type) => {
    onGoToPublish(videoUri.path, videoUri.duration);
  };

  const renderBottomGallery = () => {
    return (
      <View style={styles.bottomGallery}>
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginStart: 10,
          }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {galleryVideoList.map((itemData, index) => {
              return (
                <TouchableOpacity
                  style={{width: '24%', marginEnd: 5}}
                  onPress={() => onGoToPublishStory(itemData)}>
                  <Image
                    source={{uri: itemData.node.image.uri}}
                    style={{
                      aspectRatio: 1 / 1,
                      borderRadius: 10,
                    }}
                  />
                  <Text style={styles.galleryTimeText}>
                    {convertTimeFormat(itemData.node.image.playableDuration)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => onGoToGallery('video')}>
            <ArrowRightIcon />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (device == null) {
    return <View />;
  } else {
    return (
      <View style={styles.root}>
        <Camera
          ref={camera}
          style={[StyleSheet.absoluteFill]}
          device={device}
          isActive={true}
          video={true}
        />
        {/* <CaptureButton
          style={styles.captureButton}
          camera={camera}
          flash={flash}
          mediaType="video"
          onMediaCaptured={onFinishRecord}
          onRecording={seconds => {
            onRecordingSecond(seconds);
          }}
        /> */}
        {recordingSeconds != 0 && (
          <View style={styles.timeView}>
            <View style={styles.timeRed}></View>
            <Text style={styles.timeText}>
              {convertTimeFormat(recordingSeconds)}
            </Text>
          </View>
        )}

        <View style={styles.actionView}>
          <TouchableOpacity onPress={onSwitchCamera}>
            <SwitchCameraIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSwitchFlash} style={{marginTop: 10}}>
            <FlashIcon />
          </TouchableOpacity>
        </View>
        {renderBottomGallery()}
      </View>
    );
  }
};

export default MediaVideoSelector;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    borderRadius: 37,
    marginHorizontal: 10,
  },
  cameraView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 37,
  },
  timeView: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeRed: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF3F3F',
  },
  timeText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginStart: 5,
  },
  actionView: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  captureButton: {},
  bottomGallery: {
    width: '100%',
    height: 110,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(1, 1, 1, 0.4)',
  },
  galleryTimeText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    position: 'absolute',
    right: 5,
    top: 5,
  },
});