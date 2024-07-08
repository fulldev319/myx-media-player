import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import {FlashIcon, SwitchCameraIcon, WhiteCloseIcon} from 'assets/svg';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {CaptureButton} from 'screens/AddStoryPage/CaptureButton';
import {apiAddMemoryEmoji} from 'helper/memoryHelpers';
import {emojiList} from 'helper/constants';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {compressMedia} from 'helper/utils';

const AddEmojiScreen = ({route, navigation}) => {
  const {memoryId} = route.params!;

  const [showLoading, setShowLoading] = useState(false);
  const [selectedAddEmoji, setSelectedAddEmoji] = useState(null);
  const [emojiImagePath, setEmojiImagePath] = useState(null);

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );

  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission !== 'authorized') {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission !== 'authorized') {
        navigation.goBack();
      }
    }
  };

  const onSwitchCamera = () => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  };

  const onSwitchFlash = () => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  };

  const onRecordingSecond = seconds => {};

  const onFinishPhoto = (imageUri, type) => {
    const filePath = 'file:///' + imageUri.path;
    setEmojiImagePath(filePath);
  };

  const onAddEmoji = async () => {
    if (selectedAddEmoji === null) return;

    setShowLoading(true);
    let mediaUrl = '';

    if (emojiImagePath) {
      let base64String;
      base64String = await compressMedia('image', emojiImagePath);
      base64String = await getBase64String(base64String);

      mediaUrl = await uploadFileToIPFS(base64String, 'image/jpeg');
    }

    const res = await apiAddMemoryEmoji({
      memoryId: memoryId,
      emoji: selectedAddEmoji,
      mediaUrl,
    });

    setShowLoading(true);

    try {
      if (res.success) {
        navigation.pop();
      }
    } catch (error) {
      console.log('emoji error: ', error);
    } finally {
    }
  };

  const renderAddEmojiMediaView = () => {
    return (
      <View style={{flex: 1, marginVertical: 27}}>
        {emojiImagePath ? (
          <Image source={{uri: emojiImagePath}} />
        ) : (
          device && (
            <Camera
              ref={camera}
              style={[StyleSheet.absoluteFill]}
              device={device}
              isActive={true}
              photo={true}
            />
          )
        )}
        {emojiImagePath ? (
          <View />
        ) : (
          <TouchableOpacity
            onPress={onSwitchCamera}
            style={{
              position: 'absolute',
              bottom: 25,
              left: 20,
            }}>
            <SwitchCameraIcon />
          </TouchableOpacity>
        )}
        {emojiImagePath ? (
          <View />
        ) : (
          <CaptureButton
            camera={camera}
            flash={flash}
            mediaType="photo"
            position={'bottom'}
            onMediaCaptured={onFinishPhoto}
            onRecording={seconds => {
              onRecordingSecond(seconds);
            }}
          />
        )}
        {emojiImagePath ? (
          <View />
        ) : (
          <TouchableOpacity
            onPress={onSwitchFlash}
            style={{position: 'absolute', bottom: 20, right: 20}}>
            <FlashIcon />
          </TouchableOpacity>
        )}
        {emojiImagePath && (
          <Image
            source={{uri: emojiImagePath}}
            style={[StyleSheet.absoluteFill, {borderRadius: 30}]}
            resizeMode={'cover'}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <View style={styles.addEmojiHeader}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <WhiteCloseIcon />
          </TouchableOpacity>
          <Text style={styles.addEmojiTitle}>Add Emoji</Text>
        </View>
        <View style={styles.addEmojiContent}>{renderAddEmojiMediaView()}</View>
        <View style={styles.addEmojiBottom}>
          <ScrollView
            scrollEventThrottle={0}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.addEmojiList}>
            {emojiList.map((item, _) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.addEmojiListItem,
                    selectedAddEmoji === item && {backgroundColor: 'white'},
                  ]}
                  onPress={() => setSelectedAddEmoji(item)}>
                  <Text style={{fontSize: selectedAddEmoji === item ? 40 : 20}}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.addEmojiSubmit} onPress={onAddEmoji}>
            <Text style={styles.addEmojiSubmitTxt}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showLoading && (
        <View style={styles.loadingContainer}>
          <Progress.Circle
            size={80}
            indeterminate={true}
            borderWidth={5}
            color={'rgba(255, 102, 81, 1)'}
            thickness={20}
          />
        </View>
      )}
    </View>
  );
};

export default AddEmojiScreen;

export const styles = StyleSheet.create({
  addEmojiHeader: {
    flexDirection: 'row',
    backgroundColor: 'black',
    marginTop: 60,
  },
  addEmojiTitle: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginEnd: 29,
  },
  addEmojiContent: {
    flex: 1,
  },
  addEmojiBottom: {
    marginBottom: 40,
    alignItems: 'center',
  },
  addEmojiList: {
    height: 70,
  },
  addEmojiListItem: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
  },
  addEmojiSubmit: {
    width: 225,
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  addEmojiSubmitTxt: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 20,
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
