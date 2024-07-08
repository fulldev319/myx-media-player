/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {FeedNavigator} from './feed';
import {SettingNavigator} from './setting';
import SocialTabPage from 'screens/social/index';

import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import {getToken} from 'helper/storageHelper';
import BottomTabBar from './BottomTabBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {HomeNavigator} from './home';
import chatAction from 'redux/chats/actions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {MapNavigator} from './map';
import {ForYouNavigator} from './for_you';

const Tab = createBottomTabNavigator();

const TabNavigator = ({navigation}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    const token = await getToken();
    const isOnboarding = await AsyncStorage.getItem('@isOnboardingDone');

    if (
      token === '' ||
      token === null ||
      token === undefined ||
      isOnboarding !== 'true'
    ) {
      navigation.navigate('LoginNavigator');
    } else {
      dispatch(chatAction.getAllChatsRequest({userId: user.id}));
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="ForYou"
      screenOptions={({}) => ({
        headerShown: false,
      })}
      tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen name="Social" component={SocialTabPage} />
      <Tab.Screen name="Feed" component={MapNavigator} />
      <Tab.Screen name="ForYou" component={ForYouNavigator} />
      <Tab.Screen name="Groups" component={SettingNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
