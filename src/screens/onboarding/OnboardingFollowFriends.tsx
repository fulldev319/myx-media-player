import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  apiGetContacts,
  apiFollowPeople,
  apiUnFollowPeople,
} from 'helper/userHelpers';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import {OnboardingFriendsCard} from './cards/OnboardingFriendsCard';

const OnboardingFollowFriendPage = () => {
  const navigation = useNavigation();
  const [hasMore, setHasMore] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [arrFriends, setArrFriends] = useState([]);
  const [arrFollowed, setArrFollowed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    loadLocalSavedData();
    loadMorePeople();
  }, []);

  const loadLocalSavedData = async () => {
    const savedData = await AsyncStorage.getItem('@onboardingFriends');
    if (savedData) {
      setArrFollowed(savedData.split(','));
    }
  };

  const saveLocalSavedData = async () => {
    await AsyncStorage.setItem('@onboardingFriends', arrFollowed.toString());
  };

  const loadMorePeople = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      const res = await apiGetContacts(lastId);
      setIsLoading(false);
      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);

        setArrFriends(prev => [...prev, ...res.data]);
        const followedUsers = res.data.filter(
          (item, index) => item.isFollowed === true,
        );
        setArrFollowed(prev => [...prev, ...followedUsers]);
      }
    }
  };

  const onFollowPeople = async peopleId => {
    setShowLoading(true);
    const res = await apiFollowPeople(peopleId);
    if (res.success) {
      setArrFollowed(prev => [...prev, ...[peopleId]]);
    }
    setShowLoading(false);
  };

  const onUnfollowPeople = async peopleId => {
    setShowLoading(true);
    const res = await apiUnFollowPeople(peopleId);

    if (res.success) {
      const filteredArr = arrFollowed.filter(
        (item, index) => item !== peopleId,
      );
      setArrFollowed(filteredArr);
    }
    setShowLoading(false);
  };

  const onContinue = async () => {
    await saveLocalSavedData();
    await AsyncStorage.setItem('@onboardingStep', 'genres');
    navigation.navigate('OnboardingSelectGenresPage');
  };

  return (
    <View>
      <ScrollView
        style={[styles.root]}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMorePeople();
          }
        }}
        scrollEventThrottle={500}>
        <View style={styles.progressView}>
          <View style={styles.activeProgress}></View>
        </View>
        <Text style={styles.txtHelpUs}>Help us get to know you</Text>
        <Text style={styles.txtFollow}>
          Follow your friends {'\n'}from your contact
        </Text>
        <View style={styles.content}>
          {arrFriends.map((item, index) => {
            const isFollowing = arrFollowed.filter(
              (followedItem, index) => item.id === followedItem,
            );

            return (
              <OnboardingFriendsCard
                data={item}
                isFollowing={isFollowing.length > 0}
                onFollow={id => onFollowPeople(id)}
                onUnFollow={id => onUnfollowPeople(id)}
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

export default OnboardingFollowFriendPage;

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
    width: '25%',
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
    marginTop: 30,
    marginBottom: 200,
  },
});
