import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FeedHomePage from 'screens/feed/FeedHomePage';

const Stack = createStackNavigator();

export const FeedNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'FeedHomePage'}>
      <Stack.Screen
        name="FeedHomePage"
        component={FeedHomePage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
