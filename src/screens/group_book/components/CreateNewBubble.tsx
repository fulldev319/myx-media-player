import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {ArrowLeftIcon} from 'assets/svg';
import {CreateCategoryIcon, PhotoShotIcon, UpdateCategoryIcon} from '../assets';
import {PrimaryModal} from 'components/common/PrimaryModal';

interface CreateNewBubbleSheetProps {
  visible: boolean;
  selectedBubble: any;
  isUpdating: boolean;
  isMember: boolean;
  onUpdateBubble: ({name, description, image}) => void;
  hideModal: () => void;
}

const CreateNewBubbleSheet = (props: CreateNewBubbleSheetProps) => {
  const {
    visible,
    selectedBubble,
    isUpdating,
    isMember,
    onUpdateBubble,
    hideModal,
  } = props;

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  useEffect(() => {
    if (selectedBubble.id) {
      setName(selectedBubble.name);
      setImage(selectedBubble.image);
      setDescription(selectedBubble.description);
    }
  }, [selectedBubble]);

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
    onUpdateBubble({name, description, image});
  };

  return (
    <PrimaryModal visible={visible} hideModal={hideModal}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={hideModal} style={styles.backButton}>
            <ArrowLeftIcon color="black" />
          </TouchableOpacity>
          <Text style={styles.editTopicLabel}>
            {selectedBubble.id ? 'Update Category' : 'Create Category'}
          </Text>
        </View>

        {(!selectedBubble.id || isMember) && (
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
                <TouchableOpacity onPress={addBackground}>
                  <ImageBackground
                    source={require('assets/images/BubbleBackground.png')}
                    style={styles.bgImageContainer}>
                    <Text numberOfLines={2} style={styles.addBgTitle}>
                      {name}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            <View style={styles.photoShot}>
              <PhotoShotIcon />
            </View>
          </View>
        )}

        <View style={styles.borderTitleView}>
          <Text style={styles.borderTitle}>Event Title</Text>
          <TextInput
            value={name}
            onChangeText={text => setName(text)}
            maxLength={140}
            placeholder={'Enter Bubble Name...'}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            style={styles.createSlambookInput}
          />
        </View>
        {isUpdating ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.publishBtn} onPress={saveGroupBubble}>
            <Text style={styles.publishSlambookTxt}>
              {selectedBubble.id ? (
                <UpdateCategoryIcon />
              ) : (
                <CreateCategoryIcon />
              )}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </PrimaryModal>
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
  },
  editTopicLabel: {
    fontSize: 18,
    fontFamily: 'Poppins',
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginRight: 40,
  },
  borderTitleView: {
    borderWidth: 1,
    borderColor: '#00000020',
    borderRadius: 8,
    width: '100%',
    marginBottom: 30,
    padding: 12,
    marginTop: 20,
  },
  borderTitle: {
    fontSize: 10,
    color: 'black',
    opacity: 0.6,
    fontFamily: 'Poppins',
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
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  createSlambookInput: {
    width: '100%',
    fontSize: 14,
    color: 'black',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    marginTop: 8,
  },
  publishBtn: {
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
    width: 144,
    height: 144,
    borderRadius: 72,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  uploadingIndicator: {
    width: 144,
    height: 144,
    backgroundColor: '#ffffff',
    borderRadius: 72,
  },
  background: {
    backgroundColor: 'white',
    borderRadius: 45,
    marginHorizontal: 0,
  },
  indicator: {
    backgroundColor: 'transparent',
    marginVertical: 0,
    width: 60,
    height: 2,
  },
  photoShot: {
    position: 'absolute',
    bottom: 0,
    right: 90,
  },
});
