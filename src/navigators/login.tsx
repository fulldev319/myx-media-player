import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {LoginPage} from 'screens/login';
import LoginWithTwitterPage from 'screens/login/LoginWithTwitter';
import OnboardingFollowFriendPage from 'screens/onboarding/OnboardingFollowFriends';
import OnboardingSelectGenresPage from 'screens/onboarding/OnboardingSelectGenres';
import OnboardingSelectArtistsPage from 'screens/onboarding/OnboardingSelectArtists';
import OnboardingSetProfilePage from 'screens/onboarding/OnboardingSetProfile';

const Stack = createStackNavigator();

export const LoginNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'LoginPage'}>
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginWithTwitterPage"
        component={LoginWithTwitterPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OnboardingFollowFriendPage"
        component={OnboardingFollowFriendPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OnboardingSelectGenresPage"
        component={OnboardingSelectGenresPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OnboardingSelectArtistsPage"
        component={OnboardingSelectArtistsPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OnboardingSetProfilePage"
        component={OnboardingSetProfilePage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
