import {ImageUploadIcon, TrashIcon} from 'assets/svg/profileIcons';
import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import appAction from 'redux/app/actions';
import ImagePicker from 'react-native-image-crop-picker';
import {useToast} from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import {apiCreatePlayList} from 'helper/trackHelpers';
import appActions from 'redux/app/actions';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {compressMedia} from 'helper/utils';

export const AddTrackPlayListPage = ({onFinished, onClose}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<any>();
  const [imageName, setImageName] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const onPickImage = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(async _image => {
      const filePath = _image.path;
      const arrFileProp = filePath.split('/');
      const fileName = arrFileProp[arrFileProp.length - 1];

      setImage(_image);
      setImageName(fileName);
    });
  };

  const validateAndUpload = async () => {
    if (!title) {
      toast.show({
        description: 'Title is required',
      });
      return '';
    } else if (!image) {
      toast.show({
        description: 'You need to upload Playlist Image.',
      });
      return '';
    }
    let base64String;
    base64String = await compressMedia('image', image.path);
    base64String = await getBase64String(base64String);
    const imageUrl = await uploadFileToIPFS(base64String, 'image/jpeg');
    if (!imageUrl) {
      toast.show({
        description: 'Failed to upload Playlist Image.',
      });

      setImage(null);
      setImageName('');
      return '';
    }
    return imageUrl;
  };

  const handleSaveChanges = async () => {
    onClose && onClose();
    dispatch(appActions.showLoadingBar());

    const imageUrl = await validateAndUpload();
    if (!imageUrl) {
      dispatch(appActions.dismissLoadingBar());
      return;
    }

    apiCreatePlayList(
      title,
      description,
      imageUrl,
      isPrivate ? 'private' : 'public',
    )
      .then(res => {
        if (res.success && res.playlistId) {
          onFinished && onFinished(res.playlistId);
        }
      })
      .finally(() => {
        dispatch(appActions.dismissLoadingBar());
        dispatch(appActions.dismissAddPlayListDialog());
      });
  };

  return (
    <View style={[styles.root]}>
      <View style={styles.mainContainer}>
        <Text style={styles.typo01}>Create New Playlist</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.typo02}>Playlist Name</Text>
          <TextInput
            style={styles.typo03}
            value={title}
            onChangeText={value => {
              setTitle(value);
            }}
            placeholder="Title..."
            placeholderTextColor="#A7A7A7"
          />
        </View>
        <View style={[styles.inputContainer, {paddingVertical: 10}]}>
          <Text style={styles.typo02}>Description</Text>
          <TextInput
            style={[styles.typo03, {textAlignVertical: 'top'}]}
            value={description}
            onChangeText={value => {
              setDescription(value);
            }}
            placeholder=""
            placeholderTextColor="#A7A7A7"
            multiline={true}
            numberOfLines={3}
          />
        </View>
        <View style={styles.inputImgContainer}>
          <Text style={styles.typo02}>Upload Image</Text>
          {image ? (
            <View style={styles.showImageContainer}>
              <View style={styles.imagePreview}>
                <Image
                  style={styles.image}
                  source={{uri: image.path}}
                  resizeMode="cover"
                />
                <Text style={[styles.typo03, styles.imageName]}>
                  {imageName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setImage(null);
                  setImageName('');
                }}>
                <TrashIcon />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadImageBtn}
              onPress={onPickImage}>
              <ImageUploadIcon />
              <Text style={[styles.typo04]}>Upload Image</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.description}>
          <Text style={styles.typo05}>File Supported: PNG, JPG, GIF</Text>
          <Text style={styles.typo05}>Minimum Size: 400x400px</Text>
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.optionLabel}>Private Playlist</Text>
          <ToggleSwitch
            isOn={isPrivate}
            onColor="#fe4c37"
            offColor="#FFFFFF99"
            size="medium"
            onToggle={isOn => setIsPrivate(isOn)}
          />
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={handleSaveChanges}>
          <Text style={styles.typo06}>Save Playlist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mainContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginBottom: 24,
  },
  inputImgContainer: {
    height: 100,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadImageBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    width: '100%',
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showImageContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePreview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 5,
  },
  imageName: {
    flex: 1,
    marginHorizontal: 16,
  },
  optionContainer: {
    paddingTop: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF99',
    paddingHorizontal: 8,
  },
  actionBtn: {
    height: 53,
    backgroundColor: '#FF6651',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
  },
  typo01: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 40,
  },
  typo02: {
    position: 'absolute',
    left: 16,
    top: -8,
    paddingHorizontal: 8,
    backgroundColor: '#1F1F1F',
    lineHeight: 14,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 10,
    color: '#FFFFFF99',
  },
  typo03: {
    height: 53,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  typo04: {
    marginTop: 10,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  typo05: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF99',
  },
  typo06: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
