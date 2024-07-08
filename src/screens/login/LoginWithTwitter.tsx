import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WhiteCloseIcon} from 'assets/svg';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import {loginWithSpotify} from 'helper/authHelpers';
import {setToken} from 'helper/storageHelper';
import {useDispatch} from 'react-redux';
import authAction from 'redux/auth/actions';
import mapAction from 'redux/map/actions';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {spotifyGetMe} from 'helper/userHelpers';
import {useSpotifyContext} from 'contexts/SpotifyContext';

const LoginWithTwitterPage = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {token, onError, authenticate} = useSpotifyContext();

  useEffect(() => {
    if (token) {
      setTimeout(async () => {
        loginFlow();
      });
    }
  }, [token]);

  const onSignIn = async () => {
    if (token) {
      loginFlow();
    } else {
      authenticate({
        showDialog: false,
        playURI: '',
        authType: 'TOKEN',
      });
    }
  };

  const loginFlow = async () => {
    setIsLoading(true);
    try {
      const userInfo = await spotifyGetMe(token);
      const res: any = await loginWithSpotify(
        userInfo.display_name,
        userInfo.display_name,
        userInfo.id,
        userInfo.uri,
        userInfo.images.length > 0 ? userInfo.images[0].url : '',
        userInfo.product,
      );

      const mapSize = {lat: res.mapLat, long: res.mapLong};
      if (res?.accessToken) {
        await setToken(res.accessToken);

        const user = {
          userData: res.userData,
          countryData: res.countries,
          onboarding: res.onboarding,
        };

        dispatch(authAction.loginSuccess({}));
        dispatch(authAction.loginSuccess(user));
        dispatch(mapAction.setMapSize(mapSize));
        if (res.mapSettings) {
          dispatch(mapAction.setMapSetting(res.mapSettings));
        } else {
          dispatch(
            mapAction.setMapSetting({
              radios: true,
              friends: true,
              artists: true,
              memories: true,
            }),
          );
        }
        if (res.onboarding) {
          await AsyncStorage.setItem('@isOnboardingDone', 'true');
          navigation.navigate('TabPage');
        }
      } else {
        if (!res.onboarding) {
          navigation.navigate('OnboardingSetProfilePage', {
            spotifyId: userInfo.id,
            spotifyUri: userInfo.uri,
          });
        }
      }
    } catch (err) {
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {!isLoading ? (
        <View style={styles.root}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <WhiteCloseIcon />
            </TouchableOpacity>
            <Text style={styles.title}>Login with Twitter</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.txtAuthorize}>
              Authorize this Clio Music to user your account
            </Text>
            <Image
              source={require('./../../assets/images/share_with_twitter.png')}
              style={styles.imgShare}
            />
            <Text style={styles.txtDesc}>
              This music will be able to: {'\n'}• Access your profile
              information {'\n'}• Get your contact list
            </Text>
            <View style={{justifyContent: 'flex-end', flex: 1}}>
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btnSubmit} onPress={onSignIn}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0.9, y: 0.9}}
                    colors={['#ff3f3f', '#ff701f']}
                    style={[StyleSheet.absoluteFill, styles.btnBgEffect]}>
                    <Text style={styles.buttonText}>Allow Access</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={[styles.btnSubmit, styles.btnDenyAccess]}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Text style={styles.buttonText}>Deny Access</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
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
    </SafeAreaView>
  );
};

export default LoginWithTwitterPage;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    paddingHorizontal: 34,
  },
  header: {
    marginVertical: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {},
  title: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingStart: -30,
  },
  body: {
    flex: 1,
    marginBottom: 30,
  },
  txtAuthorize: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
  },
  imgShare: {
    width: 150,
    height: 62,
    marginTop: 50,
    alignSelf: 'center',
  },
  txtDesc: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 73,
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
    fontWeight: '400',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  btnDenyAccess: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 27,
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
