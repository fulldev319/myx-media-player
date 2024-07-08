import {BackIcon, CameraIcon} from 'assets/svg/profileIcons';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {
  apiEditProfileInfo,
  apiMakeProfilePrivate,
  apiUpdateProfileImage,
  apiUpdateWallpaperImage,
  getDefaultAvatar,
  getDefaultBackground,
} from 'helper/userHelpers';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import actions from 'redux/auth/actions';
import appActions from 'redux/app/actions';

export const EditProfilePage = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const {goBack} = useNavigation();
  const [profileImage, setProfileImage] = useState('');
  const [wallPaperImage, setWallPaperImage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (user) {
      console.log(user);
      setUserData();
    }
  }, [user]);

  const setUserData = () => {
    setWallPaperImage(user.wallPaperImage);
    setProfileImage(user.profileImage);
    setDisplayName(user.username);
    setUserName(user.handle);
    setDescription(user.description);
    setIsPrivate(user.isPrivate);
  };

  const onPickAvatar = () => {
    ImagePicker.openPicker({
      title: 'Select Avatar',
      mediaType: 'photo',
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    }).then(async image => {
      // const filePath = image.path;
      console.log(image);
      const imageUrl = await uploadFileToIPFS(image.data, image.mime);
      if (imageUrl) {
        apiUpdateProfileImage(imageUrl).then(res => {
          if (res.success) {
            dispatch(actions.updateProfileRequest(res.data));
            dispatch(
              appActions.setSnakeSuccessMessage('Image updated successfully!'),
            );
          } else {
            console.log('failed01');
          }
        });
      } else {
        console.log('failed02');
      }
    });
  };

  const onPickWallpaper = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then(async image => {
      const imageUrl = await uploadFileToIPFS(image.data, image.mime);
      if (imageUrl) {
        apiUpdateWallpaperImage(imageUrl).then(res => {
          if (res.success) {
            dispatch(actions.updateProfileRequest(res.data));
            dispatch(
              appActions.setSnakeSuccessMessage(
                'Wallpaper updated successfully!',
              ),
            );
          } else {
            console.log('failed01');
          }
        });
      } else {
        console.log('failed02');
      }
    });
  };

  const onSaveProfile = () => {
    apiEditProfileInfo(displayName, userName, description).then(res => {
      if (res.success) {
        dispatch(actions.updateProfileRequest(res.data));
        dispatch(
          appActions.setSnakeSuccessMessage('Profile updated successfully!'),
        );
      } else {
        console.log('failed01');
      }
    });
    goBack();
  };

  const onTogglePrivate = (_isPrivate: boolean) => {
    apiMakeProfilePrivate(_isPrivate).then(res => {
      if (res.success) {
        dispatch(actions.updateProfileRequest(res.data));
        dispatch(
          appActions.setSnakeSuccessMessage('Profile updated successfully!'),
        );
      } else {
        console.log('failed01');
      }
    });
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.root]}>
      <View style={styles.background}>
        <ImageBackground
          style={styles.bgImage}
          resizeMode="stretch"
          source={
            wallPaperImage ? {uri: wallPaperImage} : getDefaultBackground()
          }>
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.3)', 'rgba(0,0,0,1)']}
            style={styles.bgMask}
          />
        </ImageBackground>
      </View>
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              goBack();
            }}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={onPickWallpaper}>
            <CameraIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={profileImage ? {uri: profileImage} : getDefaultAvatar()}
          />
          <TouchableOpacity style={styles.imageBtn} onPress={onPickAvatar}>
            <CameraIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Display Name</Text>
          <TextInput
            style={styles.inputText}
            value={displayName}
            onChangeText={value => {
              setDisplayName(value);
            }}
            placeholder=""
            placeholderTextColor="#A7A7A7"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>User Name</Text>
          <TextInput
            style={styles.inputText}
            value={userName}
            onChangeText={value => {
              setUserName(value);
            }}
            placeholder=""
            placeholderTextColor="#A7A7A7"
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            {height: 100, justifyContent: 'flex-start'},
          ]}>
          <Text style={styles.inputLabel}>Short Bio</Text>
          <TextInput
            style={[
              styles.inputText,
              {textAlignVertical: 'top', marginTop: 10},
            ]}
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
          <Text style={styles.optionLabel}>Private Account</Text>
          <ToggleSwitch
            isOn={isPrivate}
            onColor="#fe4c37"
            offColor="#252525"
            size="medium"
            onToggle={isOn => onTogglePrivate(isOn)}
          />
        </View>
        <TouchableOpacity style={{width: '100%'}} onPress={onSaveProfile}>
          <LinearGradient
            colors={['#FF3F3F', '#FF701F']}
            useAngle={true}
            angle={120}
            style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000000',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: 202,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  bgMask: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 26,
    alignItems: 'center',
  },
  header: {
    paddingTop: 74,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  imageContainer: {
    marginTop: 50,
    marginBottom: 27,
    width: 108,
    height: 108,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  imageBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginTop: 31,
    width: '100%',
    paddingHorizontal: 24,
    height: 53,
    justifyContent: 'center',
  },
  inputLabel: {
    position: 'absolute',
    lineHeight: 13,
    top: -8,
    left: 15,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF99',
    paddingHorizontal: 8,
    backgroundColor: '#000000',
  },
  inputText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
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
  saveBtn: {
    marginTop: 80,
    width: '100%',
    height: 56,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
