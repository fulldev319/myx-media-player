import {CaptureIcon, CaptureStopIcon, CaptureVideoIcon} from 'assets/svg';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native';
import Reanimated, {
  cancelAnimation,
  useSharedValue,
} from 'react-native-reanimated';
import type {
  Camera,
  PhotoFile,
  TakePhotoOptions,
  TakeSnapshotOptions,
  VideoFile,
} from 'react-native-vision-camera';
import {CAPTURE_BUTTON_SIZE, SCREEN_WIDTH} from './Constants';

interface Props extends ViewProps {
  camera: React.RefObject<Camera>;
  flash: 'off' | 'on';
  mediaType: 'photo' | 'video';
  onMediaCaptured: (
    media: PhotoFile | VideoFile,
    type: 'photo' | 'video',
  ) => void;
  onRecording: (seconds: number) => void;
}

const _CaptureButton: React.FC<Props> = ({
  camera,
  flash,
  mediaType,
  onMediaCaptured,
  onRecording,
}): React.ReactElement => {
  const [isRecording, setIsRecording] = useState(false);
  const recordingProgress = useSharedValue(0);
  const prevTimer = useRef(null);
  const currentSeconds = useSharedValue(0);

  const takePhotoOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      skipMetadata: true,
    }),
    [flash],
  );

  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      console.log('Taking photo...');
      const photo = await camera.current.takePhoto(takePhotoOptions);
      onMediaCaptured(photo, 'photo');
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  }, [camera, onMediaCaptured, takePhotoOptions]);

  const startCountingSeconds = () => {
    console.log('-- started');
    prevTimer.current = setInterval(() => {
      const nextSec = currentSeconds.value + 1;
      updateSeconds(nextSec);
    }, 1000);
  };

  const updateSeconds = nextSec => {
    currentSeconds.value = nextSec;
    onRecording(currentSeconds.value);
  };

  const stopCountingSeconds = () => {
    currentSeconds.value = 0;
    clearInterval(prevTimer.current);
    onRecording(0);
  };

  const onStoppedRecording = useCallback(() => {
    setIsRecording(false);
    stopCountingSeconds();
    cancelAnimation(recordingProgress);
    console.log('stopped recording video!');
  }, [recordingProgress]);

  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      console.log('calling stopRecording()...');
      await camera.current.stopRecording();
      console.log('called stopRecording()!');
    } catch (e) {
      console.error('failed to stop recording!', e);
    }
  }, [camera]);

  const startRecording = useCallback(() => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      startCountingSeconds();
      camera.current.startRecording({
        flash: flash,
        onRecordingError: error => {
          console.error('Recording failed!', error);
          onStoppedRecording();
        },
        onRecordingFinished: video => {
          console.log(`Recording successfully finished! ${video.path}`);
          onMediaCaptured(video, 'video');
          onStoppedRecording();
        },
      });
      // TODO: wait until startRecording returns to actually find out if the recording has successfully started
      console.log('called startRecording()!');
      setIsRecording(true);
    } catch (e) {
      console.error('failed to start recording!', e, 'camera');
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);
  //#endregion

  if (mediaType === 'video') {
    return (
      <View style={styles.container}>
        {isRecording ? (
          <TouchableOpacity style={styles.button} onPress={stopRecording}>
            <CaptureStopIcon />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={startRecording}>
            <CaptureVideoIcon />
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <CaptureIcon />
        </TouchableOpacity>
      </View>
    );
  }
};

export const CaptureButton = React.memo(_CaptureButton);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
  },
});
