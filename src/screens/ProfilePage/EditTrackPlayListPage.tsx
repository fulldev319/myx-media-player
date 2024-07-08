/* eslint-disable react-native/no-inline-styles */
import {CameraIcon} from 'assets/svg/profileIcons';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appAction from 'redux/app/actions';
import ImagePicker from 'react-native-image-crop-picker';
import {useToast} from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import {apiEditPlayList, apiGetPlayList} from 'helper/trackHelpers';
import {useNavigation} from '@react-navigation/native';
import appActions from 'redux/app/actions';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {RootState} from 'redux/interfaces';
import {compressMedia} from 'helper/utils';

export const EditTrackPlayListPage = () => {
  const {data} = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const toast = useToast();
  const {navigate} = useNavigation();
  const closePage = () => {
    dispatch(appAction.dismissEditPlayListDialog());
  };

  const [playlistId, setPlayListId] = useState(data?.playlist?.id);
  const [title, setTitle] = useState<string>(data?.playlist?.title);
  const [description, setDescription] = useState<string>(
    data?.playlist?.description,
  );
  const [image, setImage] = useState<any>();
  const [imagePath, setImagePath] = useState<string>(data?.playlist?.image);
  const [isPrivate, setIsPrivate] = useState<boolean>(
    data?.playlist?.permission === 'private',
  );

  const onPickImage = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(async _image => {
      const filePath = _image.path;
      setImagePath(filePath);
      setImage(_image);
    });
  };

  const validateAndUpload = async () => {
    if (!title) {
      toast.show({
        description: 'Title is required',
      });
      return '';
    } else if (!imagePath) {
      toast.show({
        description: 'You need to upload Playlist Image.',
      });
      return '';
    }
    if (image) {
      let base64String;
      base64String = await compressMedia('image', image.path);
      base64String = await getBase64String(base64String);
      const imageUrl = await uploadFileToIPFS(base64String, 'image/jpeg');
      if (!imageUrl) {
        toast.show({
          description: 'Failed to upload Playlist Image.',
        });

        setImage(null);
        return '';
      }
      return imageUrl;
    } else {
      return imagePath;
    }
  };

  const handleSaveChanges = async () => {
    const imageUrl = await validateAndUpload();
    if (!imageUrl) {
      return;
    }
    dispatch(appActions.showLoadingBar());
    apiEditPlayList(
      playlistId,
      title,
      description,
      imageUrl,
      isPrivate ? 'private' : 'public',
    )
      .then(res => {
        console.log(res);
        if (res.success) {
          navigate('TrackPlayListPage', {playlistId: playlistId});
        }
      })
      .finally(() => {
        dispatch(appActions.dismissLoadingBar());
        dispatch(appActions.dismissEditPlayListDialog());
      });
  };

  useEffect(() => {
    if (playlistId) {
      apiGetPlayList(playlistId).then(res => {
        if (res.success) {
          setTitle(res.data.title);
          setDescription(res.data.description);
          setImagePath(res.data.image);
          setIsPrivate(res.data.permission === 'private');
        }
      });
    }
  }, [playlistId]);

  return (
    <View style={[styles.root]}>
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.clseContainer} onPress={closePage}>
            <View style={styles.closeBtn} />
          </TouchableOpacity>
          <Text style={styles.typo01}>Edit Playlist</Text>
          <View style={styles.inputImgContainer}>
            <Image
              style={styles.image}
              source={{uri: imagePath}}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.uploadImageBtn}
              onPress={onPickImage}>
              <CameraIcon withRect={false} />
              <Text style={styles.typo05}>Edit Cover</Text>
            </TouchableOpacity>
          </View>
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
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleSaveChanges}>
            <Text style={styles.typo06}>Save Playlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000CC',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContainer: {
    backgroundColor: '#1F1F1F',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    alignItems: 'center',
    paddingHorizontal: 34,
    paddingBottom: 50,
  },
  clseContainer: {
    marginTop: 30,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    width: 48,
    height: 4,
    borderRadius: 4,
  },
  inputContainer: {
    // height: 53,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginBottom: 24,
  },
  inputImgContainer: {
    height: 153,
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadImageBtn: {
    position: 'absolute',
    left: 16,
    bottom: 11,
    height: 34,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#010101',
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  optionContainer: {
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
    fontSize: 20,
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
    fontSize: 12,
    color: '#FFFFFF',
  },
  typo06: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
