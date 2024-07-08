import React, {useCallback, useEffect, useMemo, useState} from 'react';
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

import {uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {BackIcon} from 'screens/TrackPlayList/components/TrackPlayListIcons';

interface CreateNewBubbleSheetProps {
  createNewBubbleSheetRef: any;
  selectedBubble: any;
  isUpdating: boolean;
  onBack: () => void;
  onUpdateBubble: ({name, description, image}) => void;
}

const CreateNewBubbleSheet = (props: CreateNewBubbleSheetProps) => {
  const {
    createNewBubbleSheetRef,
    selectedBubble,
    isUpdating,
    onBack,
    onUpdateBubble,
  } = props;

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const snapPointsAddTopic = useMemo(() => [560, 560], []);

  useEffect(() => {
    if (selectedBubble.id) {
      setName(selectedBubble.name);
      setImage(selectedBubble.image);
      setDescription(selectedBubble.description);
    }
  }, [selectedBubble]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) hideModal();
  }, []);

  const hideModal = () => {
    onBack();
    setName('');
    setImage('');
    setDescription('');
  };

  const onPickWallpaper = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then(async image => {
      setIsUploadingFile(true);
      const url = await uploadFileToIPFS(image.data, image.mime);
      if (url) {
        setImage(url);
      } else {
        console.log('failed02');
      }
      setIsUploadingFile(false);
    });
  };

  const addBackground = () => {
    onPickWallpaper();
  };

  const saveGroupBubble = () => {
    if (!name) {
      alert('Name is Required!');
      return;
    }
    if (!description) {
      alert('Description is Required!');
      return;
    }
    onUpdateBubble({name, description, image});
  };

  return (
    <BottomSheetModal
      ref={createNewBubbleSheetRef}
      index={1}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
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
          <Text style={styles.editTopicLabel}>
            {selectedBubble.id ? 'Update Bubble' : 'Add New'}
          </Text>
        </View>

        {(!selectedBubble.id || selectedBubble.is_member) && (
          <View style={styles.borderTitleView}>
            <View style={styles.borderTitleViewContent}>
              {isUploadingFile && (
                <ActivityIndicator style={styles.uploadingIndicator} />
              )}
              {!isUploadingFile &&
                (image ? (
                  <TouchableOpacity
                    onPress={addBackground}
                    style={styles.bgImageContainer}>
                    <Image source={{uri: image}} style={styles.bgImage} />
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
        )}

        <View style={styles.borderTitleView}>
          <View style={styles.borderTitleViewContent}>
            <BottomSheetTextInput
              value={name}
              onChangeText={text => setName(text)}
              maxLength={140}
              placeholder={'Enter Bubble Name...'}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={styles.createSlambookInput}
            />
          </View>
          <Text style={styles.borderTitle}>Bubble Name</Text>
        </View>

        <View style={styles.borderTitleView}>
          <View style={styles.borderTitleViewContent}>
            <BottomSheetTextInput
              value={description}
              onChangeText={text => setDescription(text)}
              maxLength={140}
              placeholder={'Enter Bubble Description...'}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={styles.createSlambookInput}
            />
          </View>
          <Text style={styles.borderTitle}>Bubble Description</Text>
        </View>

        {isUpdating ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.publishBtn} onPress={saveGroupBubble}>
            <Text style={styles.publishSlambookTxt}>
              {selectedBubble.id ? 'Update Bubble' : 'Save Bubble'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </BottomSheetModal>
  );
};

export default CreateNewBubbleSheet;

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
  background: {
    backgroundColor: '#1F1F1F',
    borderRadius: 45,
    marginHorizontal: 0,
  },
  indicator: {
    backgroundColor: 'transparent',
    marginVertical: 0,
    width: 60,
    height: 2,
  },
});
