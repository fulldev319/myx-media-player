import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {styles} from './index.styles';
import LinearGradient from 'react-native-linear-gradient';
import {TwitterWhiteIcon} from 'assets/svg/social';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from 'helper/storageHelper';

export const LoginPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const isOnboarding = await AsyncStorage.getItem('@isOnboardingDone');
    const token = await getToken();

    if (isOnboarding !== 'true' && token !== '' && token != null) {
      const onboardingStep = await AsyncStorage.getItem('@onboardingStep');
      if (onboardingStep === null) {
        navigation.navigate('OnboardingFollowFriendPage');
      } else if (onboardingStep === 'genres') {
        navigation.navigate('OnboardingSelectGenresPage');
      } else if (onboardingStep === 'artist') {
        navigation.navigate('OnboardingSelectArtistsPage');
      } else {
        navigation.navigate('OnboardingSetProfilePage');
      }
    }
  };

  const OnGoToAccess = () => {
    navigation.navigate('LoginWithTwitterPage');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.backgroundContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('./../../assets/images/img_login.png')}
            style={styles.imageView}
            resizeMode={'cover'}
          />
        </View>
        <View style={styles.effectView}>
          <LinearGradient
            colors={['rgba(255, 112, 31, 0.6)', 'rgba(255, 112, 31, 0.2)']}
            style={styles.headerFilter}
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.1)', 'rgba(0,0,0,1)']}
            style={styles.headerFilter}
          />
          <Image
            source={require('./../../assets/images/trending_light_bg.png')}
            style={styles.backgroundLight}
            resizeMode={'stretch'}
          />
        </View>
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.txtAppName}>CLIO MUSIC</Text>
        <Text style={styles.txtDesc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae et
          vitae at nunc.
        </Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnSubmit}
            onPress={() => {
              OnGoToAccess();
            }}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 0.9}}
              colors={['#ff3f3f', '#ff701f']}
              style={[StyleSheet.absoluteFill, styles.btnBgEffect]}>
              <TwitterWhiteIcon />
              <Text style={styles.buttonText}>Login with Twitter</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={styles.txtHavingTrouble}>
          Having trouble logging in?{' '}
          <Text style={styles.txtGetHelp}>Get Help</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};
