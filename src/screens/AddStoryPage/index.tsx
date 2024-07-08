import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import {StackScreenProps} from '@react-navigation/stack';
import {RoundCloseIcon} from 'assets/svg';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState, useMemo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import ProgressBar from 'react-native-animated-progress';
import SelectMedia from './SelectMedia';
import {apiPublishStory} from 'helper/storyHelpers';
import appActions from 'redux/app/actions';
import {useDispatch} from 'react-redux';

export const AddStoryPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const onGoToPublishStory = (mediaUri, mediaType, duration) => {
    navigation.navigate('PublishStoryPage', {
      videoUri: mediaUri,
      mediaType,
      duration: duration,
    });
  };

  const onTextMediaPublish = async textArray => {
    setIsLoading(true);

    const permission = 'public';
    const mediaUrl = '';
    const duration = 0;
    const format = 'txt';
    const labelArr = textArray;

    const res = await apiPublishStory(
      permission,
      'text',
      mediaUrl,
      duration,
      format,
      labelArr,
    );

    if (res.success) {
      navigation.navigate('Music');
      dispatch(appActions.setSnakeSuccessMessage('Story upload successful!'));
    }

    setIsLoading(false);
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
    navigation.navigate('MediaVideoGalleryPage', {mediaType});
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <RoundCloseIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Add to story</Text>
      </View>
      <View style={styles.body}>
        <SelectMedia
          onGoToGallery={onGoToGallery}
          onGoToPublishStory={onGoToPublishStory}
          onTextMediaPublish={onTextMediaPublish}
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
});
