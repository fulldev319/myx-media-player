import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomePage} from 'screens/home/HomePage';

const Stack = createStackNavigator();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'HomePage'}>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
