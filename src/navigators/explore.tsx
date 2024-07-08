import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import ExplorePage from 'screens/explore';
import {TrendingMusicPage} from 'screens/trending_music';
import {TrendingPeoplePage} from 'screens/trending_people';
import {TuneInRadioPage} from 'screens/tune_in_radio';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

export const ExploreNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'ExplorePage'}>
      <Stack.Screen
        name="ExplorePage"
        component={ExplorePage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TrendingMusicPage"
        component={TrendingMusicPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TrendingPeoplePage"
        component={TrendingPeoplePage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TuneInRadioPage"
        component={TuneInRadioPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
