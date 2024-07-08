import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import {useDispatch} from 'react-redux';
import authAction from 'redux/auth/actions';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RedCameraIcon} from 'assets/svg';
import {compressMedia} from 'helper/utils';
import {loginWithSpotify} from 'helper/authHelpers';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import {setToken} from 'helper/storageHelper';

const OnboardingSetProfilePage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {spotifyId, spotifyUri} = route.params!;
  const dispatch = useDispatch();

  const [displayName, setDisplayName] = useState('');
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSelectProfile = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    }).then(async image => {
      const filePath = image.path;
      setImageUrl(filePath);
    });
  };

  const onSaveProfile = async () => {
    if (displayName === '' || userName === '') {
      return;
    }

    setIsLoading(true);
    let mediaUrl = '';
    if (imageUrl) {
      let base64String;
      base64String = await compressMedia('image', imageUrl);
      base64String = await getBase64String(base64String);
      mediaUrl = await uploadFileToIPFS(base64String, 'image/jpeg');
    }

    const res: any = await loginWithSpotify(
      displayName,
      userName,
      spotifyId,
      spotifyUri,
      mediaUrl ? mediaUrl : 'assets/images/default_profile.png',
      description,
    );
    setIsLoading(false);
    if (res?.accessToken) {
      await setToken(res.accessToken);
      dispatch(authAction.loginSuccess(res.userData));
      await AsyncStorage.setItem('@isOnboardingDone', 'true');
      navigation.navigate('TabPage');
    }
  };

  return (
    <View>
      {!isLoading && (
        <ScrollView style={[styles.root]}>
          <View style={styles.progressView}>
            <View style={styles.activeProgress} />
          </View>
          <Text style={styles.txtHelpUs}>Help us get to know you</Text>
          <Text style={styles.txtFollow}>Set your profile</Text>
          <View style={styles.content}>
            <TouchableOpacity
              onPress={onSelectProfile}
              style={[styles.userImage, {marginVertical: 30}]}>
              <Image
                source={{
                  uri: imageUrl === null ? defaultAvatar : imageUrl,
                }}
                style={styles.userImage}
              />
              <View style={{position: 'absolute', bottom: 0, right: 0}}>
                <RedCameraIcon />
              </View>
            </TouchableOpacity>
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
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Short Bio</Text>
              <TextInput
                style={[styles.inputText, {textAlignVertical: 'top'}]}
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
          </View>
        </ScrollView>
      )}
      {!isLoading && (
        <View style={styles.actionContainer}>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnSubmit}
              onPress={() => {
                onSaveProfile();
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 0.9, y: 0.9}}
                colors={['#ff3f3f', '#ff701f']}
                style={[StyleSheet.absoluteFill, styles.btnBgEffect]}>
                <Text style={styles.buttonText}>Save Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isLoading && (
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

export default OnboardingSetProfilePage;

const defaultAvatar =
  'data:image/jpeg;base64,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';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    paddingHorizontal: 34,
    paddingTop: 60,
  },
  progressView: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 1,
  },
  activeProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FF6651',
    borderRadius: 1,
  },
  txtHelpUs: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 40,
  },
  txtFollow: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 36,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  actionContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 34,
  },
  btnContainer: {
    width: '100%',
    height: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBgEffect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27,
    borderWidth: 0,
  },
  btnSubmit: {
    width: '100%',
    height: 54,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 27,
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 200,
  },
  userImage: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignSelf: 'center',
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
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF99',
    paddingHorizontal: 8,
    backgroundColor: '#000000',
  },
  inputText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
