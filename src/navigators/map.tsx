import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// import {HomePage} from 'screens/home/HomePage';
import MapHomePage from 'screens/map/MapHome';
import NewWorldPage from 'screens/map/new_world/NewWorld';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {Platform} from 'react-native';

const Stack = createStackNavigator();

export const MapNavigator = () => {
  const {auth} = useSelector((state: RootState) => state);
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator
        initialRouteName={
          Platform.OS !== 'android' && auth.onboarding
            ? 'MapHomePage'
            : 'NewWorld'
        }>
        <Stack.Screen
          name="MapHomePage"
          component={MapHomePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NewWorld"
          component={NewWorldPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
};
