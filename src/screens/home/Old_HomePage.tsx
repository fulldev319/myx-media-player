/* eslint-disable react-native/no-inline-styles */
import {StackScreenProps} from '@react-navigation/stack';
import {MediaCard} from 'components/cards/MediaCard';
import {UserCard} from 'components/cards/UserCard';
import {PageHeader} from 'components/header/PageHeader';
import {apiGetStoriesWithUser} from 'helper/storyHelpers';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  View,
  Platform,
} from 'react-native';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

const mediaList = [
  {
    image: require('./../../assets/sample/media_001.png'),
    artist: {
      image: require('./../../assets/sample/artist_001.png'),
      name: 'Jessica',
    },
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim....',
    bookMark: true,
    like: true,
  },
  {
    image: require('./../../assets/sample/media_002.png'),
    artist: {
      image: require('./../../assets/sample/artist_001.png'),
      name: 'Jessica',
    },
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim....',
    bookMark: false,
    like: false,
  },
];

export const HomePage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [lastId, setLastId] = useState(null);
  const [arrStory, setArrStory] = useState([]);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStory();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const loadStory = async () => {
    const res = await apiGetStoriesWithUser(user.id, lastId);

    if (res.success) {
      const resData = res.data;
      setArrStory(resData.data);

      if (resData.hasMore) {
        // set lastId
      }
    }
  };

  const onAddStory = () => {
    // navigation.navigate('AddStoryPage');
    navigation.navigate('FeedDetailPage');
  };

  const onGoToStoryDetail = itemData => {
    navigation.navigate('StoryDetailPage', {data: itemData});
  };

  const checkCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission !== 'authorized') {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission !== 'authorized') {
      }
    }

    hasAndroidPermission();
  };

  const hasAndroidPermission = async () => {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  return (
    <View style={styles.root}>
      <PageHeader navigation={navigation} />
      <View style={styles.container}>
        <ScrollView horizontal>
          <View style={styles.users}>
            <UserCard
              isAction={true}
              key={-1}
              onPress={() => {
                onAddStory();
              }}
            />
            {arrStory.map((user, index) => (
              <UserCard
                user={user}
                key={index}
                style={{marginLeft: 9}}
                onPress={() => {
                  onGoToStoryDetail(user);
                }}
              />
            ))}
          </View>
        </ScrollView>
        <ScrollView>
          <View style={styles.cards}>
            {mediaList.map((media, index) => (
              <MediaCard media={media} key={index} style={{marginBottom: 30}} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    paddingTop: 30,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
  },
  users: {
    marginVertical: 23,
    flexDirection: 'row',
    paddingHorizontal: 26,
  },
  cards: {
    width: '100%',
    paddingHorizontal: 26,
    paddingBottom: 100,
  },
});
