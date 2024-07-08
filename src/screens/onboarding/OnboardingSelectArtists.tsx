import {useNavigation} from '@react-navigation/native';
import {apiFollowArtist, apiUnFollowArtist} from 'helper/artistHelper';
import {apiGetTopArtist} from 'helper/trackHelpers';
import {SCREEN_WIDTH} from 'helper/utils';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {OnboardingArtistsCard} from './cards/OnboardingArtistsCard';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingSelectArtistsPage = () => {
  const navigation = useNavigation();
  const cardWidth = (SCREEN_WIDTH - 68 - 16) / 2;
  const [hasMore, setHasMore] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [arrArtists, setArrArtists] = useState([]);
  const [arrFollowed, setArrFollowed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    loadLocalSavedData();
    loadMoreArtists();
  }, []);

  const loadLocalSavedData = async () => {
    const savedData = await AsyncStorage.getItem('@onboardingArtists');
    if (savedData) {
      setArrFollowed(savedData.split(','));
    }
  };

  const saveLocalSavedData = async () => {
    await AsyncStorage.setItem('@onboardingArtists', arrFollowed.toString());
  };

  const loadMoreArtists = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      const res = await apiGetTopArtist(lastId);
      setIsLoading(false);
      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);

        setArrArtists(prev => [...prev, ...res.data]);
        const followedUsers = res.data.filter(
          (item, index) => item.isFollowed === true,
        );
        setArrFollowed(prev => [...prev, ...followedUsers]);
      }
    }
  };

  const onFollowArtist = async artistId => {
    setShowLoading(true);
    const res = await apiFollowArtist(artistId);
    if (res.success) {
      setArrFollowed(prev => [...prev, ...[artistId]]);
    }
    setShowLoading(false);
  };

  const onUnfollowArtist = async artistId => {
    setShowLoading(true);
    const res = await apiUnFollowArtist(artistId);

    if (res.success) {
      const filteredArr = arrFollowed.filter(
        (item, index) => item !== artistId,
      );
      setArrFollowed(filteredArr);
    }
    setShowLoading(false);
  };

  const onContinue = async () => {
    await saveLocalSavedData();
    await AsyncStorage.setItem('@onboardingStep', 'profile');
    navigation.navigate('OnboardingSetProfilePage');
  };

  return (
    <View>
      <ScrollView
        style={[styles.root]}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMoreArtists();
          }
        }}
        scrollEventThrottle={500}>
        <View style={styles.progressView}>
          <View style={styles.activeProgress}></View>
        </View>
        <Text style={styles.txtHelpUs}>Help us get to know you</Text>
        <Text style={styles.txtFollow}>
          Select your favourite {'\n'}artists
        </Text>
        <View style={styles.content}>
          {arrArtists.map((item, index) => {
            const isFollowing = arrFollowed.filter(
              (followedItem, index) => item.id === followedItem,
            );

            return (
              <OnboardingArtistsCard
                data={item}
                isFollowing={isFollowing.length > 0}
                onFollow={id => onFollowArtist(id)}
                onUnFollow={id => onUnfollowArtist(id)}
                style={{width: cardWidth, marginBottom: 16}}
              />
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.actionContainer}>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnSubmit}
            onPress={() => {
              onContinue();
            }}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 0.9}}
              colors={['#ff3f3f', '#ff701f']}
              style={[StyleSheet.absoluteFill, styles.btnBgEffect]}>
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
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

export default OnboardingSelectArtistsPage;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    paddingHorizontal: 34,
    paddingTop: 60,
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
    width: '75%',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 200,
  },
});
