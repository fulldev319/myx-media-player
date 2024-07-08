import React, {useCallback, useMemo, useState} from 'react';
import {BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {
  ActivityIndicator,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {Camera} from 'react-native-vision-camera';

import {uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {BackIcon} from 'screens/TrackPlayList/components/TrackPlayListIcons';

interface TopicEditModalProps {
  topicEditModalRef: any;
  isUpdating: boolean;
  onBack: () => void;
  onUpdateTopic: (title: string, imageUrl: string) => void;
}

const TopicEditModal = (props: TopicEditModalProps) => {
  const {topicEditModalRef, isUpdating, onBack, onUpdateTopic} = props;

  const [title, setTitle] = useState('');
  const [showPlaceHolder, setShowPlaceholder] = useState(true);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const snapPointsAddTopic = useMemo(() => [460, 460], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) hideModal();
  }, []);

  const hideModal = () => {
    onBack();
    setTitle('');
    setImageUrl('');
    setShowPlaceholder(true);
  };

  const onPickWallpaper = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then(async image => {
      setIsUploadingFile(true);
      const url = await uploadFileToIPFS(image.data, image.mime);
      if (url) {
        setImageUrl(url);
      } else {
        console.log('failed02');
      }
      setIsUploadingFile(false);
    });
  };

  const addBackground = () => {
    onPickWallpaper();
  };

  const saveTopic = () => {
    onUpdateTopic(title, imageUrl);
  };

  return (
    <BottomSheetModal
      ref={topicEditModalRef}
      index={1}
      backgroundStyle={{
        backgroundColor: '#1F1F1F',
        borderRadius: 45,
        marginHorizontal: 0,
      }}
      handleIndicatorStyle={{
        backgroundColor: 'transparent',
        marginVertical: 0,
        width: 60,
        height: 2,
      }}
      snapPoints={snapPointsAddTopic}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      onChange={handleSheetChanges}>
      <View style={[StyleSheet.absoluteFill, {top: 10, left: 34, right: 34}]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={hideModal} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.editTopicLabel}>Edit Topic</Text>
        </View>

        <View style={styles.borderTitleView}>
          <View style={styles.borderTitleViewContent}>
            {isUploadingFile && (
              <ActivityIndicator style={styles.uploadingIndicator} />
            )}
            {!isUploadingFile &&
              (imageUrl ? (
                <TouchableOpacity
                  onPress={addBackground}
                  style={styles.bgImageContainer}>
                  <Image source={{uri: imageUrl}} style={styles.bgImage} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={addBackground}
                  style={styles.addBgContainer}>
                  <SimpleLineIcons name="camera" color="#FF6651" size={38} />
                  <Text style={styles.addBgTitle}>Add Background Image</Text>
                </TouchableOpacity>
              ))}
          </View>
          <Text style={styles.borderTitle}>Background Image</Text>
        </View>

        <View style={styles.borderTitleView}>
          <View style={styles.borderTitleViewContent}>
            <BottomSheetTextInput
              value={title}
              onChangeText={title => setTitle(title)}
              maxLength={140}
              placeholder={showPlaceHolder ? 'Enter Topic Name...' : ''}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={styles.createSlambookInput}
              onFocus={() => {
                setShowPlaceholder(false);
              }}
              onEndEditing={() => {
                setShowPlaceholder(true);
              }}
            />
          </View>
          <Text style={styles.borderTitle}>Topic Name</Text>
        </View>

        {isUpdating ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.publishBtn} onPress={saveTopic}>
            <Text style={styles.publishSlambookTxt}>Save Topic</Text>
          </TouchableOpacity>
        )}
      </View>
    </BottomSheetModal>
  );
};

export default TopicEditModal;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#0E0E0E',
    borderWidth: 1,
    borderRadius: 32,
    marginRight: 24,
  },
  editTopicLabel: {
    fontSize: 20,
    fontFamily: 'Poppins',
    color: 'white',
    fontWeight: 'bold',
  },
  borderTitleView: {
    borderWidth: 1,
    borderColor: '#ffffff10',
    borderRadius: 8,
    width: '100%',
    marginBottom: 30,
  },
  borderTitle: {
    fontSize: 10,
    color: '#ffffff70',
    fontFamily: 'Poppins',
    position: 'absolute',
    top: -8,
    left: 15,
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 10,
  },
  borderTitleViewContent: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBgContainer: {
    marginVertical: 48,
    alignItems: 'center',
  },
  addBgTitle: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: 'white',
    marginTop: 14,
  },
  createSlambookInput: {
    width: '100%',
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  publishBtn: {
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishSlambookTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  bgImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  bgImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  uploadingIndicator: {
    paddingVertical: 100,
  },
});
