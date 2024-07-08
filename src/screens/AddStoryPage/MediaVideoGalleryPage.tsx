import {StackScreenProps} from '@react-navigation/stack';
import {FlashIcon, RoundCloseIcon, SwitchCameraIcon} from 'assets/svg';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {CaptureButton} from './CaptureButton';
import {convertTimeFormat} from 'helper/utils';
import {GalleryMediaCard} from 'components/cards/GallerMediaCard';

export const MediaVideoGalleryPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const mediaType = route.params!.mediaType;
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [galleryVideoList, setGalleryVideoList] = useState([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState([]);

  const {width} = Dimensions.get('window');
  const size = (width - 60) / 3;

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  useEffect(() => {
    loadVideosFromLocal();
  }, []);

  const loadVideosFromLocal = async () => {
    const videos = await CameraRoll.getPhotos({
      first: 50,
      assetType: mediaType === 'video' ? 'Videos' : 'Photos',
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

  const onFinishRecord = (videoUri, type) => {};

  const onClose = () => {
    navigation.pop();
  };

  const onGoToPublish = () => {
    navigation.navigate('PublishStoryPage', {
      mediaType,
      videoUri: galleryVideoList[selectedVideoIndex[0]].node.image.uri,
      duration:
        galleryVideoList[selectedVideoIndex[0]].node.image.playableDuration,
    });
  };

  const onSelectGalleryItem = selectedIndex => {
    if (selectedVideoIndex.includes(selectedIndex)) {
      setSelectedVideoIndex(prev =>
        prev.filter(item => item !== selectedIndex),
      );
    } else {
      setSelectedVideoIndex(prev => [...prev, selectedIndex]);
    }
    forceUpdate();
  };

  const forceUpdate = useForceUpdate();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <RoundCloseIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Add to story</Text>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.container}>
          <View style={styles.cameraView}>
            {device && (
              <Camera
                ref={camera}
                style={[StyleSheet.absoluteFill]}
                device={device}
                isActive={true}
                video={true}
              />
            )}
            <CaptureButton
              style={styles.captureButton}
              camera={camera}
              flash={flash}
              mediaType={mediaType}
              onMediaCaptured={onFinishRecord}
              onRecording={seconds => {
                onRecordingSecond(seconds);
              }}
            />
            {recordingSeconds !== 0 && (
              <View style={styles.timeView}>
                <View style={styles.timeRed}></View>
                <Text style={styles.timeText}>
                  {convertTimeFormat(recordingSeconds)}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.galleryContainer}>
            <Text style={styles.galleryTitle}>Upload video from gallery</Text>
            <FlatList
              data={galleryVideoList}
              renderItem={({item, index}) => (
                <GalleryMediaCard
                  key={index}
                  index={index}
                  selectedIndex={selectedVideoIndex}
                  size={size}
                  marginRight={0}
                  marginTop={20}
                  data={item}
                  onSelected={onSelectGalleryItem}
                />
              )}
              keyExtractor={item => `${item.node.image.uri}_${item.title}`}
              numColumns={3}
              columnWrapperStyle={{justifyContent: 'space-between'}}
            />
          </View>
        </View>
      </ScrollView>

      {selectedVideoIndex && selectedVideoIndex.length > 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            height: 75,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: '90%',
              height: 50,
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onGoToPublish}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    marginTop: 30,
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
    marginTop: 40,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  cameraView: {
    width: '90%',
    aspectRatio: 1 / 1,
    marginHorizontal: 20,
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
  galleryContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  galleryTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
