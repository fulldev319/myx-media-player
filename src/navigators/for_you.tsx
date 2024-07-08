import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ForYouHomePage} from 'screens/for_you/home/ForYouHomePage';

const Stack = createStackNavigator();

export const ForYouNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'ForYouHomePage'}>
      <Stack.Screen
        name="ForYouHomePage"
        component={ForYouHomePage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
